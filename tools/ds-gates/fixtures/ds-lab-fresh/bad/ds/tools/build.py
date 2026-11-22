#!/usr/bin/env python3
import os

out = os.environ.get("DS_LAB_STANDALONE_OUT")
assert out, "a compliant build honors $DS_LAB_STANDALONE_OUT"
with open(out, "w", encoding="utf-8") as fh:
    fh.write("fixture lab build output v1\n")
