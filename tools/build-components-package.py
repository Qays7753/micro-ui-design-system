#!/usr/bin/env python3
"""Package editable public sources and evidence, without credentials or agent state."""
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "deliverables" / "micro-components-editable.zip"
DIRECTORIES = ("assets", "components", "shared", "previews", "docs", "references", "reviews", "prompts", "tools", "handoff")
FILES = ("README.md", "AGENTS.md", "DESIGN.md", "MANIFEST.json", "pyproject.toml", "uv.lock",
         "tools/preview-server.py", "tools/concepts-check.py",
         "tools/manifest-build.py", "tools/build-components-package.py")


def main():
    OUT.parent.mkdir(exist_ok=True)
    paths = [ROOT / name for name in FILES if (ROOT / name).is_file()]
    for name in DIRECTORIES:
        paths.extend(path for path in (ROOT / name).rglob("*")
                     if path.is_file() and not path.is_symlink() and not any(part.startswith(".") or part == "__pycache__"
                                                  for part in path.relative_to(ROOT).parts))
    with ZipFile(OUT, "w", compression=ZIP_DEFLATED, compresslevel=6) as archive:
        for path in sorted(set(paths)):
            archive.write(path, path.relative_to(ROOT))
    print(f"{OUT.relative_to(ROOT)}: {len(set(paths))} editable source/evidence files")


if __name__ == "__main__":
    main()