#!/usr/bin/env bash
# Static library: no app dependencies, database migrations, or UI build step.
# Workflow reconciliation starts/restarts the preview after this script finishes.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

python3 - <<'PY'
from pathlib import Path

for script in sorted(Path("tools").glob("*.py")):
    compile(script.read_bytes(), str(script), "exec")
print("Python tools: syntax valid")
PY

# Refresh derived deliverables from the merged sources; do not rewrite test evidence.
python3 tools/manifest-build.py
python3 tools/build-components-package.py