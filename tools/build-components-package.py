#!/usr/bin/env python3
"""Package editable public sources and evidence, without credentials or agent state."""
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "generated-artifacts" / "deliverables" / "micro-components-editable.zip"
DIRECTORIES = ("assets", "components", "shared", "previews", "docs", "references", "reviews", "prompts", "tools", "handoff")
FILES = ("README.md", "AGENTS.md", "DESIGN.md", "MANIFEST.json", "pyproject.toml", "uv.lock",
         "tools/preview-server.py", "tools/concepts-check.py",
         "tools/manifest-build.py", "tools/build-components-package.py")


def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    paths = [ROOT / name for name in FILES if (ROOT / name).is_file()]
    for name in DIRECTORIES:
        paths.extend(path for path in (ROOT / name).rglob("*")
                     if path.is_file() and not path.is_symlink() and not any(part.startswith(".") or part == "__pycache__"
                                                  for part in path.relative_to(ROOT).parts))
    with ZipFile(OUT, "w", compression=ZIP_DEFLATED, compresslevel=6) as archive:
        for path in sorted(set(paths)):
            info = ZipInfo(path.relative_to(ROOT).as_posix(), (1980, 1, 1, 0, 0, 0))
            info.compress_type = ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            archive.writestr(info, path.read_bytes(), compress_type=ZIP_DEFLATED, compresslevel=6)
    print(f"{OUT.relative_to(ROOT)}: {len(set(paths))} editable source/evidence files")


if __name__ == "__main__":
    main()