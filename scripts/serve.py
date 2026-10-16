"""Servidor local: solo expone los archivos públicos de la carta."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import unquote, urlsplit
ROOT = Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs): super().__init__(*args, directory=str(ROOT), **kwargs)
    def do_GET(self):
        path = unquote(urlsplit(self.path).path)
        parts = Path(path.lstrip('/')).parts
        if '..' in parts or not (path in ('/', '/index.html', '/menu.html') or (parts and parts[0] in {'css', 'js', 'data', 'assets'})):
            self.send_error(404); return
        target = (ROOT / path.lstrip('/')).resolve()
        if path == '/': target = ROOT / 'index.html'
        if not target.is_relative_to(ROOT) or not target.is_file(): self.send_error(404); return
        super().do_GET()
    def do_HEAD(self): self.do_GET()
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()
if __name__ == '__main__':
    print('Carta Akasaka: http://localhost:8000', flush=True)
    ThreadingHTTPServer(('127.0.0.1', 8000), Handler).serve_forever()
