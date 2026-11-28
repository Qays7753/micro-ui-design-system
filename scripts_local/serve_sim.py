import http.server, socketserver, functools, os, sys
root = sys.argv[1] if len(sys.argv) > 1 else 'ds/sim/dist'
port = int(sys.argv[2]) if len(sys.argv) > 2 else 5077
# Serve under /micro-ui-design-system/ prefix (Pages-like layout).
class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=root, **kw)
    def translate_path(self, path):
        if path.startswith('/micro-ui-design-system/'):
            path = path[len('/micro-ui-design-system'):]
        elif path == '/micro-ui-design-system':
            path = '/'
        return super().translate_path(path)
socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("127.0.0.1", port), Handler) as httpd:
    httpd.serve_forever()
