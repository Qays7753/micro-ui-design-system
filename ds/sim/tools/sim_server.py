#!/usr/bin/env python3
"""sim_server.py — embedded HTTP server for the sim build (in-process, so it
survives the sandbox's between-command process recycling when started from
the walk script itself)."""
import functools
import http.server
import os
import socketserver
import threading


def serve(dist_dir: str, port: int = 5077):
    root = "/tmp/serve"
    os.makedirs(f"{root}/micro-ui-design-system", exist_ok=True)
    link = f"{root}/micro-ui-design-system"
    if os.path.islink(link) or os.path.isdir(link):
        os.system(f"rm -rf {link}")
    os.system(f"ln -s {dist_dir} {link}")

    class H(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *a, **kw):
            super().__init__(*a, directory=root, **kw)

        def end_headers(self):
            self.send_header("Cache-Control", "no-store")
            self.send_header("Service-Worker-Allowed", "/micro-ui-design-system/")
            super().end_headers()

        def log_message(self, *a):
            pass

    socketserver.TCPServer.allow_reuse_address = True
    srv = socketserver.TCPServer(("127.0.0.1", port), H)
    t = threading.Thread(target=srv.serve_forever, daemon=True)
    t.start()
    return srv


SIM_URL = "http://127.0.0.1:5077/micro-ui-design-system/"
