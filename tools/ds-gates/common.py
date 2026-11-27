#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Shared framework for the @micro/ds quality gates (batch 1, stage S2).

Contract every ds gate follows (task S2 / plan section 6):
  - one line per check:  "PASS <check-id>[ | <detail>]"  /  "FAIL <check-id> | <violation>"
  - a final summary:     "total: N ok, M failed"
  - a gate whose target does not exist yet (no components, no lab page) prints
    "not applicable yet: <reason>" after the total and exits 0 — documented,
    never silent.
  - exit code 0 iff no FAIL.
  - --target <path-or-url> redirects the gate at another tree (fixture).
  - --prove re-runs the gate as a subprocess on its own fixtures:
      fixtures/<gate>/bad   must exit 1 (the gate detects its violation)
      fixtures/<gate>/clean must exit 0
    and exits 0 only when both behave as expected. A gate that can never
    fail is rejected (plan S2: "بوابة لا تفشل أبداً لا قيمة لها").

Browser gates run on TWO engines (Chromium + WebKit, plan section 6) and
document each engine separately: <check-id>/chromium and <check-id>/webkit.
Both engines launch with the environment untouched first; only when a
plain WebKit launch fails does the session retry once with the software-EGL
fallback environment (apply_webkit_env below + tools/README.md) — machines
where the browsers run as officially installed are never touched.

No gate writes a file it later controls (manifest --check pattern): reports
are written only to explicit --out paths chosen by the caller.
"""
import argparse
import contextlib
import glob
import http.server
import json
import os
import re
import socket
import subprocess
import sys
import threading
from pathlib import Path

GATES_DIR = Path(__file__).resolve().parent
ROOT = GATES_DIR.parent.parent          # repo root (micro-ui-design-system)
FIXTURES = GATES_DIR / "fixtures"
TOOLS_DIR = ROOT / "tools"

sys.path.insert(0, str(TOOLS_DIR))      # browser_support (Chromium selection)

with open(GATES_DIR / "config.json", encoding="utf-8") as fh:
    CONFIG = json.load(fh)

AR = re.compile(r"[\u0600-\u06FF]")


# --------------------------------------------------------------------------
# Gate result model
# --------------------------------------------------------------------------
class Gate:
    def __init__(self, name):
        self.name = name
        self.checks = []  # (id, ok, detail)

    def ok(self, check_id, detail=""):
        self.checks.append((check_id, True, detail))

    def fail(self, check_id, detail):
        self.checks.append((check_id, False, detail))

    def na(self, check_id, reason):
        """A check that has nothing to check yet — documented, counts as ok."""
        self.checks.append((check_id, True, "not applicable yet: " + reason))

    @property
    def failed(self):
        return [c for c in self.checks if not c[1]]

    def all_na(self):
        return bool(self.checks) and all(d.startswith("not applicable yet:") for _, _, d in self.checks)

    def report(self):
        for check_id, ok, detail in self.checks:
            line = ("PASS " if ok else "FAIL ") + check_id
            if detail:
                line += " | " + detail
            print(line, flush=True)
        n_ok = len(self.checks) - len(self.failed)
        n_fail = len(self.failed)
        print(f"total: {n_ok} ok, {n_fail} failed", flush=True)
        if self.all_na():
            print("not applicable yet: " + self.checks[0][2][len("not applicable yet:"):], flush=True)
        return 1 if n_fail else 0


# --------------------------------------------------------------------------
# Source parsing helpers (comment-aware, string-aware)
# --------------------------------------------------------------------------
def strip_comments(src):
    """Remove // and /* */ comments while preserving strings and line count."""
    out = []
    i, n = 0, len(src)
    while i < n:
        c = src[i]
        if c == "/" and i + 1 < n and src[i + 1] == "/":
            j = src.find("\n", i)
            i = n if j == -1 else j
        elif c == "/" and i + 1 < n and src[i + 1] == "*":
            j = src.find("*/", i + 2)
            j = n if j == -1 else j + 2
            out.append(" ")
            out.append("\n" * src.count("\n", i, j))
            i = j
        elif c in "\"'`":
            j = i + 1
            while j < n:
                if src[j] == "\\":
                    j += 2
                    continue
                if src[j] == c:
                    break
                j += 1
            out.append(src[i:min(j + 1, n)])
            i = j + 1
        else:
            out.append(c)
            i += 1
    return "".join(out)


def iter_strings(src):
    """Yield (start_line, value) for every string literal in code (comments already gone)."""
    i, n, line = 0, len(src), 1
    while i < n:
        c = src[i]
        if c == "\n":
            line += 1
            i += 1
            continue
        if c in "\"'`":
            start_line = line
            j = i + 1
            while j < n:
                if src[j] == "\\":
                    j += 2
                    continue
                if c != "`" and src[j] == "\n":
                    break
                if src[j] == c:
                    break
                j += 1
            value = src[i + 1:min(j, n)]
            line += src.count("\n", i, min(j + 1, n))
            i = j + 1
            yield start_line, value
            continue
        i += 1


def _glob_to_regex(pat):
    """Path glob -> anchored regex with real glob semantics.

    The old inline translation (replace ** with .* THEN * with [^/]*)
    corrupted the stars introduced by the first step, so
    "ds/src/**/*.test.tsx" never matched files one level deeper than
    ds/src/<seg>/<file> — component tests under ds/src/components/<Name>/
    slipped through every documented test exclusion. Proper translation:
    "**/" matches zero or more whole segments, "**" any path text, "*"
    one segment part.
    """
    out = ["^"]
    i = 0
    while i < len(pat):
        if pat[i:i + 3] == "**/":
            out.append("(?:.*/)?")
            i += 3
        elif pat[i:i + 2] == "**":
            out.append(".*")
            i += 2
        elif pat[i] == "*":
            out.append("[^/]*")
            i += 1
        else:
            out.append(re.escape(pat[i]))
            i += 1
    out.append("$")
    return re.compile("".join(out))


def source_files(target_root, subpath, patterns, exclude=()):
    """All files under <target_root>/<subpath> matching patterns, minus exclude globs."""
    base = Path(target_root) / subpath
    if not base.is_dir():
        return []
    excluded_res = []
    for pat in exclude:
        excluded_res.append(_glob_to_regex(pat))
    found = []
    for pattern in patterns:
        for path in sorted(base.rglob(pattern)):
            rel = path.relative_to(Path(target_root)).as_posix()
            if any(rx.match(rel) for rx in excluded_res):
                continue
            found.append(path)
    return found


def rel_of(path, target_root):
    try:
        return path.relative_to(Path(target_root)).as_posix()
    except ValueError:
        return str(path)


def gzip_size(path):
    import gzip as _gzip
    with open(path, "rb") as fh:
        return len(_gzip.compress(fh.read(), compresslevel=9, mtime=0))


def read_tokens(target_root):
    tokens_path = Path(target_root) / "docs" / "design-system" / "tokens.json"
    if not tokens_path.is_file():
        return None
    with open(tokens_path, encoding="utf-8") as fh:
        return json.load(fh)


def token_by_path(tokens, dotted):
    node = tokens
    for key in dotted.split("."):
        if not isinstance(node, dict) or key not in node:
            raise KeyError(dotted)
        node = node[key]
    return node


def component_closed_list(target_root):
    """The sanctioned component list: batch-1 (S0 table in its REPORT.md, 32
    names) plus batch-2 (the «قائمة مكوّنات الدفعة الثانية» table in the batch-2
    REPORT.md — the plan's sanctioned second closed list; each unit adds its
    component there). Chart components of stage 5.7 join that table when named."""
    report = Path(target_root) / "docs" / "plans" / "design-system-batch1" / "REPORT.md"
    if not report.is_file():
        return None, "missing docs/plans/design-system-batch1/REPORT.md"
    text = report.read_text(encoding="utf-8")
    names = []
    row = re.compile(r"^\|\s*\d+\s*\|\s*`([A-Za-z][A-Za-z0-9]*)`\s*\|")
    report2 = Path(target_root) / "docs" / "plans" / "design-system-batch2" / "REPORT.md"
    texts = [text]
    if report2.is_file():
        texts.append(report2.read_text(encoding="utf-8"))
    for text in texts:
        in_table = False
        for line in text.splitlines():
            if "قائمة مكوّنات الدفعة الأولى" in line or "قائمة مكوّنات الدفعة الثانية" in line:
                in_table = True
            if in_table and row.match(line):
                name = row.match(line).group(1)
                if name not in names:
                    names.append(name)
    if not names:
        return None, "S0 component table not found in REPORT.md"
    return names, None


# --------------------------------------------------------------------------
# Browser support: engines, environment, local HTTP fixture server
# --------------------------------------------------------------------------
def webkit_install_dir():
    """Newest Playwright WebKit install directory, or None."""
    installs = glob.glob(os.path.join(os.path.expanduser("~"), ".cache", "ms-playwright", "webkit-*"))
    if not installs:
        return None
    return sorted(installs, key=lambda p: [int(x) for x in re.findall(r"\d+", p) if x.isdigit()])[-1]


def apply_webkit_env():
    """Software-EGL fallback environment for WebKit (see tools/README.md).

    Returns True only when the installed WebKit actually carries the fallback
    directories (sys/egl_vendor + sys/lib/dri inside its minibrowser-wpe
    bundle). A plain official install does not have them unless the sandbox
    setup documented in tools/README.md added them, so on a normal machine
    this returns False and the environment is left untouched.

    Called exclusively from the retry path of browser_session, after a plain
    launch already failed: an environment sourced externally always wins
    (setdefault, never overwrite).
    """
    install = webkit_install_dir()
    if not install:
        return False
    sysdir = os.path.join(install, "minibrowser-wpe", "sys")
    egl_vendor = os.path.join(sysdir, "egl_vendor")
    dri = os.path.join(sysdir, "lib", "dri")
    if not (os.path.isdir(egl_vendor) and os.path.isdir(dri)):
        return False
    env = {
        # The ldd-based host validation cannot see libraries inside the
        # browser bundle's own LD_LIBRARY_PATH; skip it and let the real
        # launch decide (the actual launch inherits those paths natively).
        "PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS": "1",
        "EGL_PLATFORM": "surfaceless",
        "LIBGL_ALWAYS_SOFTWARE": "1",
        "LIBGL_ALWAYS_INDIRECT": "0",
        "__EGL_VENDOR_LIBRARY_DIRS": egl_vendor,
        "LIBGL_DRIVERS_PATH": dri,
    }
    for key, value in env.items():
        os.environ.setdefault(key, value)
    return True


class LocalServer:
    """Ephemeral 127.0.0.1 HTTP server for fixture pages (enables route interception).

    delay_suffixes: file extensions served with a deliberate delay (used by
    ds-font-shift to hold the webfont back until the first measurement).
    aliases: {url-filename: absolute path} — lets a text-only fixture swap in
    a real tracked font file without copying binaries into fixtures/.
    """

    def __init__(self, root, delay_suffixes=(), delay_seconds=0.6, aliases=None):
        self.root = Path(root).resolve()
        self.aliases = {name: Path(path) for name, path in (aliases or {}).items()}
        self.delay_suffixes = tuple(delay_suffixes)
        self.delay_seconds = delay_seconds
        server = self

        class Handler(http.server.SimpleHTTPRequestHandler):
            def __init__(self, *a, **kw):
                kw.setdefault("directory", str(server.root))
                super().__init__(*a, **kw)

            def log_message(self, fmt, *a):
                pass  # keep gate output clean

            def translate_path(self, path):
                name = path.lstrip("/").split("?")[0]
                if name in server.aliases:
                    return str(server.aliases[name])
                return super().translate_path(path)

            def end_headers(self):
                server.httpd_common_headers(self)
                super().end_headers()

            def do_GET(self):
                path = self.translate_path(self.path)
                if path.endswith(server.delay_suffixes):
                    import time as _time
                    _time.sleep(server.delay_seconds)
                super().do_GET()

        self.httpd = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Handler)
        self.port = self.httpd.server_address[1]
        self.thread = threading.Thread(target=self.httpd.serve_forever, daemon=True)

    def httpd_common_headers(self, handler):
        handler.send_header("Cache-Control", "no-store")

    def start(self):
        self.thread.start()
        return f"http://127.0.0.1:{self.port}"

    def url(self, path=""):
        return f"http://127.0.0.1:{self.port}/{path.lstrip('/')}"

    def stop(self):
        self.httpd.shutdown()
        self.httpd.server_close()


class _Session:
    """Pages created through one browser; close() tears the whole stack down."""

    def __init__(self, pw_cm, browser):
        self._pw_cm = pw_cm
        self._browser = browser
        self._contexts = []

    def page(self, **context_options):
        ctx = self._browser.new_context(**context_options)
        self._contexts.append(ctx)
        return ctx.new_page()

    def close(self):
        with contextlib.suppress(Exception):
            for ctx in self._contexts:
                ctx.close()
        with contextlib.suppress(Exception):
            self._browser.close()
        with contextlib.suppress(Exception):
            self._pw_cm.__exit__(None, None, None)


def _open_browser_session(engine):
    """Open a browser session with the CURRENT environment (no fallback)."""
    from playwright.sync_api import sync_playwright
    from browser_support import chromium_launch_options

    pw_cm = sync_playwright()
    pw = pw_cm.__enter__()
    try:
        if engine == "chromium":
            browser = pw.chromium.launch(**chromium_launch_options())
        elif engine == "webkit":
            browser = pw.webkit.launch()
        else:
            raise ValueError("unknown engine: " + engine)
    except Exception:
        with contextlib.suppress(Exception):
            pw_cm.__exit__(None, None, None)
        raise
    return _Session(pw_cm, browser)


@contextlib.contextmanager
def browser_session(engine):
    """Context manager yielding a browser session for the given engine.

    Plain launch first: zero environment interference on machines where the
    browsers run as officially installed. Only if that launch fails AND the
    WebKit install carries the fallback dirs (apply_webkit_env) does the
    session retry once with the fallback environment — through a fresh
    driver so the variables reach the browser process chain.
    """
    try:
        session = _open_browser_session(engine)
    except Exception:
        if engine != "webkit" or not apply_webkit_env():
            raise
        session = _open_browser_session(engine)
    try:
        yield session
    finally:
        session.close()


def wait_lab_ready(page, marker="[data-ds-check]", timeout_ms=5000):
    """Wait until the lab app actually mounted (markers in the DOM).

    `load` fires before React mounts, and a fixed 150ms sleep raced under
    load (WebKit software rendering): a gate then measured an empty page and
    failed flakily. Marker-based waiting removes the race; a timeout here is
    NOT an error — pages without markers (fixture proofs) fall through and
    the gate's own checks decide.
    """
    try:
        page.wait_for_selector(marker, state="attached", timeout=timeout_ms)
    except Exception:
        pass


DEFAULT_CONTEXT = {
    "viewport": {"width": 360, "height": 780},
    "device_scale_factor": 3,
}


def resolve_page_target(target_arg, default_file="standalone.html", default_dir="previews/ds-lab"):
    """Resolve --target to a served page URL.

    Returns (kind, value): kind in {"url", "server", "na"}.
      url     -> an http(s)/file URL to open directly (server=None)
      server  -> (LocalServer, path) already started; caller must stop it
      na      -> nothing to open yet (value = reason)
    """
    if target_arg and re.match(r"^(https?|file)://", target_arg):
        return "url", target_arg
    if target_arg:
        path = Path(target_arg)
        try:
            is_root = path.resolve() == ROOT.resolve()
        except OSError:
            is_root = False
        if path.is_dir() and not is_root:
            for name in ("previews/ds-lab/standalone.html", "standalone.html",
                         "page.html", "index.html"):
                if (path / name).is_file():
                    server = LocalServer(path if "/" not in name else path / Path(name).parent)
                    base = server.start()
                    return "server", (server, base + "/" + Path(name).name)
            return "na", f"no page (previews/ds-lab/standalone.html, page.html) under {target_arg}"
        if path.is_file():
            server = LocalServer(path.parent)
            base = server.start()
            return "server", (server, base + "/" + path.name)
        if not is_root:
            return "na", "--target does not exist: " + target_arg
        # the repo root itself: fall through to the default lab page below
    default_path = ROOT / default_dir / default_file
    if default_path.is_file():
        server = LocalServer(ROOT / default_dir)
        base = server.start()
        # The probe gates inspect the COMPONENT CATALOG; the standalone's
        # default view is the demo-compose page (owner request), so the
        # default gate URL pins the catalog view. DS_VIEW=compose runs the
        # SAME gates against the default (compose) view — owner request G2
        # (the page must pass the gates too; fixes go to components/page).
        view = os.environ.get("DS_VIEW", "catalog")
        if view == "default":
            url = base + "/" + default_file
        else:
            url = base + "/" + default_file + "?view=" + view
        # 3ب.0: the default compose view fills the phone screen with the lab
        # tools folded behind a fab (the owner's phone experience); the gates
        # pin the classic strip layout with ?tools=1 so every documented
        # target (strip keys, view toggles, probes) stays reachable.
        url += "&tools=1" if "?" in url else "?tools=1"
        return "server", (server, url)
    return "na", f"{default_dir}/{default_file} does not exist yet (lab build lands in S3)"


# --------------------------------------------------------------------------
# Gate main driver (normal + prove modes)
# --------------------------------------------------------------------------
def gate_main(name, run_fn, extra_args=None):
    parser = argparse.ArgumentParser(description=f"{name} gate (@micro/ds S2)")
    parser.add_argument("--target", help="path or URL to check (default: current source/lab state)")
    parser.add_argument("--prove", action="store_true",
                        help="run on the gate fixtures: the bad one must FAIL, the clean one must PASS")
    parser.add_argument("--out", help="write a JSON report to this path")
    parser.add_argument("--engine", default="both", choices=["both", "chromium", "webkit"])
    if extra_args:
        extra_args(parser)
    args = parser.parse_args()

    if args.prove:
        return prove_main(name, run_fn, args)

    gate = Gate(name)
    try:
        run_fn(gate, args.target or str(ROOT), args)
    except Exception as exc:  # a crashed gate is a failed gate, never a green one
        gate.fail(name + "/internal", f"gate crashed: {exc!r}")
    rc = gate.report()
    if args.out:
        payload = {
            "gate": name,
            "target": args.target or str(ROOT),
            "exit": rc,
            "checks": [{"id": cid, "ok": ok, "detail": detail} for cid, ok, detail in gate.checks],
            "failed": len(gate.failed),
        }
        Path(args.out).parent.mkdir(parents=True, exist_ok=True)
        Path(args.out).write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return rc


def prove_main(name, run_fn, args):
    entry = Path(sys.argv[0]).resolve()
    base = FIXTURES / name
    checks = []
    # bad -> 1 and clean -> 0 always; a gate may add more kinds through
    # fixtures/<gate>/expectations.json, e.g. {"rootlike": 0} for a fixture
    # shaped like the repo root (previews/ds-lab/standalone.html inside).
    kinds = [("bad", 1), ("clean", 0)]
    expectations_file = base / "expectations.json"
    if expectations_file.is_file():
        import json
        for kind, expected in json.loads(expectations_file.read_text(encoding="utf-8")).items():
            kinds.append((kind, int(expected)))
    for kind, expected in kinds:
        fixture = base / kind
        check_id = f"prove/{kind}"
        if not fixture.is_dir():
            checks.append((check_id, False, f"fixture missing: {rel_of(fixture, ROOT)}"))
            continue
        cmd = [sys.executable, str(entry), "--target", str(fixture)]
        if args.engine != "both":
            cmd += ["--engine", args.engine]
        proc = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True, timeout=300)
        ok = proc.returncode == expected
        last = (proc.stdout or "").strip().splitlines()
        first_fail = next((ln for ln in last if ln.startswith("FAIL ")), "")
        detail = f"{rel_of(fixture, ROOT)} -> exit {proc.returncode} (expected {expected})"
        if first_fail:
            detail += f"; {first_fail.strip()[:160]}"
        if proc.returncode not in (0, 1):
            detail += f"; stderr: {(proc.stderr or '').strip()[:200]}"
        checks.append((check_id, ok, detail))

    n_ok = sum(1 for _, ok, _ in checks if ok)
    n_fail = len(checks) - n_ok
    for check_id, ok, detail in checks:
        print(("PASS " if ok else "FAIL ") + f"{name}/{check_id} | {detail}", flush=True)
    print(f"total: {n_ok} ok, {n_fail} failed", flush=True)
    if n_fail == 0:
        print(f"PROVEN {name} — fails on its violation fixture and passes the clean one", flush=True)
    else:
        print(f"UNPROVEN {name} — the gate did not behave as required on its fixtures", flush=True)
    return 1 if n_fail else 0
