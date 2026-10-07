#!/usr/bin/env python3
"""Fetch linked Samsung references for local reading, outside the git repository.

HTML downloads do not include dependent images, videos or fonts.
This helper does not publish third-party documents or assert redistribution rights.
"""
import argparse
import hashlib
import json
import tempfile
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REGISTER = ROOT / "references/samsung-one-ui/SOURCE-REGISTER.json"
HOSTS = {"developer.samsung.com", "design.samsung.com", "www.design.samsung.com"}
LIMIT = 20 * 1024 * 1024


def allowed(url):
    parsed = urllib.parse.urlparse(url)
    return parsed.scheme == "https" and parsed.hostname in HOSTS


class SamsungRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, request, fp, code, msg, headers, newurl):
        if not allowed(newurl):
            raise ValueError("Redirect outside the official Samsung host allowlist")
        return super().redirect_request(request, fp, code, msg, headers, newurl)


def fetch(entry, output):
    result = {"id": entry["id"], "url": entry["url"]}
    try:
        if not allowed(entry["url"]):
            raise ValueError("Source is outside the official Samsung host allowlist")
        opener = urllib.request.build_opener(SamsungRedirect())
        request = urllib.request.Request(entry["url"], headers={"User-Agent": "Micro-UI-reference-reader/1.0"})
        with opener.open(request, timeout=40) as response:
            body = response.read(LIMIT + 1)
            if len(body) > LIMIT:
                raise ValueError("Document exceeds the 20 MiB local-reading limit")
            if "/login" in response.url:
                raise ValueError("Sign-in page returned instead of a reference")
            kind = response.headers.get("Content-Type", "")
            if "pdf" not in kind and "html" not in kind:
                raise ValueError("Unexpected document content type")
            digest = hashlib.sha256(body).hexdigest()
            suffix = ".pdf" if "pdf" in kind else ".html"
            destination = output / (entry["id"] + suffix)
            destination.write_bytes(body)
            result.update(status="FETCHED", file=destination.name, http_status=response.status,
                          resolved_url=response.url, sha256=digest, bytes=len(body),
                          matches_registered_bytes=digest == entry.get("sha256"))
    except Exception as error:
        result.update(status="UNAVAILABLE", error=type(error).__name__ + ": " + str(error))
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--list", action="store_true", help="List source IDs without downloading")
    parser.add_argument("--ids", nargs="+", help="Download selected source IDs; default: all")
    parser.add_argument("--output", type=Path, default=Path(tempfile.gettempdir()) / "micro-oneui-local-reading",
                        help="Local destination outside this repository")
    args = parser.parse_args()
    entries = json.loads(REGISTER.read_text(encoding="utf-8"))["sources"]
    if args.ids:
        unknown = set(args.ids) - {e["id"] for e in entries}
        if unknown:
            parser.error("Unknown IDs: " + ", ".join(sorted(unknown)))
        entries = [e for e in entries if e["id"] in args.ids]
    if args.list:
        for entry in entries:
            print(entry["id"], entry["title"], entry["url"], sep=" | ")
        return 0
    output = args.output.expanduser().resolve()
    if output == ROOT or ROOT in output.parents:
        parser.error("Choose a destination outside the repository; downloaded documents are for local reading")
    output.mkdir(parents=True, exist_ok=True)
    with ThreadPoolExecutor(max_workers=5) as pool:
        results = list(pool.map(lambda e: fetch(e, output), entries))
    document = {"retrieved_at_utc": datetime.now(timezone.utc).isoformat(),
                "note": "FETCHED is not READ or a redistribution license. HTML assets are not bundled. "
                        "A changed byte hash is informational; it is not proof of a changed design guideline.",
                "sources": results}
    (output / "retrieval.json").write_text(json.dumps(document, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    for result in results:
        print(result["id"], result["status"])
    print("Local reading files:", output)
    return 1 if any(r["status"] == "UNAVAILABLE" for r in results) else 0


if __name__ == "__main__":
    raise SystemExit(main())
