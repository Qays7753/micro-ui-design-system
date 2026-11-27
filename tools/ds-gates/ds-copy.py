#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ds-copy — the copy dictionary is the single source of UI text (BRIEF 24, plan 8-و K30/K31).

(أ) no Arabic string inside ds/src/{components,lib,icons} — every user-visible
    string comes from ds/src/i18n/ar.ts (BRIEF 29.1-م13); English comments are
    excluded (comments are stripped before scanning).
(ب) every ar.ts entry has one of the nine kinds and respects its word ceiling:
    button ≤3, title ≤3, badge ≤2, success ≤5, error ≤12, empty ≤10, help ≤8
    (placeholder / screen-reader have no numeric ceiling in the plan — still
    checked for banned content). Words = whitespace-separated tokens; a
    {placeholder} counts as one word.
(ج) the literal banned list of BRIEF 24.2 (phrases, generic one-word buttons,
    exclamation marks anywhere) plus the 24.3 "لا تُستخدم" column (matched as
    whole words so Arabic morphology does not false-positive).
"""
import re
from pathlib import Path

from common import AR, CONFIG, Gate, gate_main, iter_strings, source_files, strip_comments, rel_of

COPY = CONFIG["copy"]
KINDS = set(COPY["kinds"])
LIMITS = COPY["kind_word_limits"]
BANNED_PHRASES = COPY["banned_phrases"]
BANNED_PREFIXES = COPY.get("banned_prefixes", [])
BANNED_BUTTONS = COPY["banned_button_words"]
LEXICON_BANNED = COPY["lexicon_banned_tokens"]
EXCLAMATION = COPY["exclamation"]

ENTRY_RX = re.compile(r"'([A-Za-z0-9_.-]+)':\s*\{\s*kind:\s*'([a-z-]+)'\s*,\s*text:\s*'((?:[^'\\]|\\.)*)'\s*\}")


SEPARATOR_TOKENS = {"·", "—"}  # punctuation separators, not words


def count_words(text):
    return len([w for w in re.split(r"\s+", text) if w and w not in SEPARATOR_TOKENS])


def token_set(text):
    return {re.sub(r"[؟.،؛:!«»…—]", "", w) for w in text.split() if w}


def check_text(key, kind, text):
    """Return a list of copy violations for one dictionary entry."""
    problems = []
    if kind not in KINDS:
        problems.append(f"unknown kind '{kind}' (not one of the nine)")
    limit = LIMITS.get(kind)
    words = count_words(text)
    override = COPY.get("brief_verbatim_overrides", {}).get(key)
    if limit is not None and words > limit and not override:
        problems.append(f"kind '{kind}' allows {limit} words, entry has {words}: «{text}»")
    for phrase in BANNED_PHRASES:
        if phrase in text:
            problems.append(f"banned phrase «{phrase}» (BRIEF 24.2)")
    if kind == "button" and text in BANNED_BUTTONS:
        problems.append(f"generic one-word button «{text}» (BRIEF 24.2)")
    if EXCLAMATION in text:
        problems.append("exclamation mark (BRIEF 24.2: none anywhere in the UI)")
    if "..." in text:
        problems.append("three dots instead of the single «…» (BRIEF 24.1-7)")
    for prefix in BANNED_PREFIXES:
        if text.startswith(prefix):
            problems.append(f"banned start «{prefix}…» (lesson rule 64: no about/meaning/read links; "
                            "rule 42: «+» opens a creation only)")
    hits = token_set(text) & set(LEXICON_BANNED)
    if hits and not override:
        # a brief_verbatim_overrides entry waives ALL heuristic limits for
        # that key (its text documents the reference per waiver) — the spec
        # mandates the wording verbatim, so 24.3's lexicon yields to it.
        problems.append(f"word(s) outside the fixed lexicon (24.3): {', '.join(sorted(hits))}")
    return problems


def run(gate: Gate, target, args):
    # ---- (أ) hardcoded Arabic in components / lib / icons ----
    # *.test.* files are excluded: vitest assertions compare against real
    # dictionary output (moneyTexts) and never render UI strings.
    scanned = []
    found = []
    for section in ("components", "lib", "icons"):
        for path in source_files(target, f"ds/src/{section}", ["*.ts", "*.tsx", "*.css"],
                                 exclude=["ds/src/**/*.test.ts", "ds/src/**/*.test.tsx"]):
            scanned.append(path)
            rel = rel_of(path, target)
            code = strip_comments(path.read_text(encoding="utf-8"))
            for line, value in iter_strings(code):
                if AR.search(value):
                    found.append(f"{rel}:{line} Arabic string «{value.strip()[:40]}» — copy belongs in ds/src/i18n/ar.ts")
    if found:
        gate.fail("ds-copy/hardcoded-arabic", f"{len(scanned)} files scanned, {len(found)} hardcoded Arabic strings")
        for f in found[:30]:
            gate.fail("ds-copy/hardcoded", f)
    else:
        gate.ok("ds-copy/hardcoded-arabic",
                f"{len(scanned)} files in components/lib/icons, zero hardcoded Arabic" if scanned
                else "no component/lib/icon sources yet (builder starts at S3)")

    # ---- (ب)+(ج) the ar.ts dictionary itself ----
    # Plan B (B0): the domain dictionary ds/src/i18n/ar-domains.ts joins the
    # same checks — an agent-2 private file outside the gate would prove
    # nothing. Both files are parsed with the same entry regex; a missing
    # ar-domains.ts is only a skip on fixtures that predate plan B (the
    # fixtures carry ar.ts alone), but when the file EXISTS its entries are
    # checked with no exceptions.
    dictionaries = []
    ar_path = Path(target) / "ds" / "src" / "i18n" / "ar.ts"
    if not ar_path.is_file():
        gate.fail("ds-copy/dictionary", "ds/src/i18n/ar.ts not found")
        return
    ar_domains_path = Path(target) / "ds" / "src" / "i18n" / "ar-domains.ts"
    if ar_domains_path.is_file():
        dictionaries.append(ar_domains_path)
    dictionaries.append(ar_path)
    problems = []
    entries = 0
    for dict_path in dictionaries:
        dict_code = dict_path.read_text(encoding="utf-8")
        for m in ENTRY_RX.finditer(dict_code):
            key, kind, text = m.group(1), m.group(2), m.group(3)
            line = dict_code.count("\n", 0, m.start()) + 1
            entries += 1
            for problem in check_text(key, kind, text):
                problems.append(f"{dict_path.name}:{line} '{key}': {problem}")
    if entries == 0:
        gate.fail("ds-copy/dictionary", "no {kind, text} entries parsed from ar.ts — parse drifted, fix the gate")
        return
    if problems:
        gate.fail("ds-copy/dictionary", f"{entries} entries checked, {len(problems)} violations")
        for p in problems[:40]:
            gate.fail("ds-copy/entry", p)
    else:
        extra = f" (+{len(dictionaries) - 1} domain file)" if len(dictionaries) > 1 else ""
        gate.ok("ds-copy/dictionary", f"{entries} entries{extra}: nine kinds, word ceilings, 24.2/24.3 bans — clean")


if __name__ == "__main__":
    raise SystemExit(gate_main("ds-copy", run))
