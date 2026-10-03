#!/usr/bin/env python3
"""Restore the complete editable ZIP and verify every part and the result."""
import hashlib
import json
import os
import tempfile
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIRECTORY = ROOT / "deliverables"

def main():
    record = json.loads((DIRECTORY / "package-parts.json").read_text())
    if record["archive"] != "micro-components-editable.zip":
        raise ValueError("Unexpected archive name")
    fd, temporary = tempfile.mkstemp(prefix="package-", suffix=".tmp", dir=DIRECTORY)
    try:
        total = 0
        digest = hashlib.sha256()
        with os.fdopen(fd, "wb") as output:
            for part in record["parts"]:
                if Path(part["file"]).name != part["file"]:
                    raise ValueError("Invalid part name")
                data = (DIRECTORY / part["file"]).read_bytes()
                if len(data) != part["bytes"] or hashlib.sha256(data).hexdigest() != part["sha256"]:
                    raise ValueError("Part integrity failed: " + part["file"])
                output.write(data)
                digest.update(data)
                total += len(data)
        if total != record["bytes"] or digest.hexdigest() != record["sha256"]:
            raise ValueError("Archive integrity failed")
        with zipfile.ZipFile(temporary) as archive:
            if archive.testzip() is not None:
                raise ValueError("ZIP integrity failed")
            count = len(archive.namelist())
        os.replace(temporary, DIRECTORY / record["archive"])
        print(f"Restored {record['archive']}: {count} files, SHA256 and CRC verified")
    finally:
        Path(temporary).unlink(missing_ok=True)

if __name__ == "__main__":
    main()
