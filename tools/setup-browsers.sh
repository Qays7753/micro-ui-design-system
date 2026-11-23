#!/bin/sh
# Official browser setup for the Micro UI check tools — the standard way on
# any new machine. Details and the constrained-sandbox fallback: tools/README.md.
#
# Usage (from the repository root, after `uv sync`):
#   sh tools/setup-browsers.sh
set -e
uv run playwright install --with-deps chromium webkit
echo "Browsers installed (Chromium + WebKit)."
