#!/usr/bin/env python3
"""Split the complete ZIP for transports with a per-request size limit."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIRECTORY = ROOT / "deliverables"
ARCHIVE = DIRECTORY / "micro-components-editable.zip"
PART_SIZE = 8 * 1024 * 1024

def main():
    data = ARCHIVE.read_bytes()
    records = []
    for old in DIRECTORY.glob(ARCHIVE.name + ".part-*"):
        old.unlink()
    for start in range(0, len(data), PART_SIZE):
        chunk = data[start:start + PART_SIZE]
        name = ARCHIVE.name + ".part-" + str(len(records) + 1).zfill(3)
        (DIRECTORY / name).write_bytes(chunk)
        records.append({"file": name, "bytes": len(chunk), "sha256": hashlib.sha256(chunk).hexdigest()})
    record = {"archive": ARCHIVE.name, "bytes": len(data), "sha256": hashlib.sha256(data).hexdigest(), "parts": records}
    (DIRECTORY / "package-parts.json").write_text(json.dumps(record, indent=2) + "\n")
    print(f"Complete archive: {len(data)} bytes; parts: {len(records)}")

if __name__ == "__main__":
    main()
