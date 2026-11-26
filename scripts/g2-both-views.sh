#!/usr/bin/env bash
# G2: run the browser gates on BOTH standalone views — ?view=catalog and
# the default (compose) view. Any compose failure must be fixed in the
# component/page, never by loosening a gate.
cd "$(dirname "$0")/.." || exit 1
GATES="ds-bidi ds-hidden-amounts ds-small-screen ds-a11y ds-states ds-tabular ds-font-shift ds-standalone-mode"
for view in catalog compose; do
  echo "===== VIEW: $view ====="
  for g in $GATES; do
    DS_VIEW=$view uv run python "tools/ds-gates/$g.py" 2>&1 | grep -v VIRTUAL | grep -E '^(PASS|FAIL|NA|total)' | sed "s/^/[$view][${g}] /"
  done
done
