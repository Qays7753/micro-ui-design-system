"""Portable Chromium selection for development checks (bundled or system)."""
import os
import shutil


def chromium_launch_options():
    path = os.environ.get("MICRO_CHROMIUM_PATH") or shutil.which("chromium")
    return {"executable_path": path} if path else {}
