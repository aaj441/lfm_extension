#!/usr/bin/env python3
"""
Last.fm Recommender Server
Supports both development and production deployment
"""

import os
import sys
from http.server import SimpleHTTPRequestHandler
from socketserver import TCPServer
from wsgiref.simple_server import WSGIServer
from wsgiref.util import setup_testing_defaults
from wsgiref.headers import Headers
import mimetypes

# Development server (when run directly)
if __name__ == "__main__":
    PORT = int(os.environ.get('PORT', 8000))
    
    class MyHTTPRequestHandler(SimpleHTTPRequestHandler):
        def end_headers(self):
            # Add CORS headers to allow API calls
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
            return super().end_headers()

        def do_OPTIONS(self):
            self.send_response(200)
            self.end_headers()

    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    with TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"\n🎵 Last.fm Recommender Server Running!")
        print(f"📱 Open in your browser: http://localhost:{PORT}")
        print(f"💻 Or access from phone: http://[your-local-ip]:{PORT}")
        print(f"\n✋ Press Ctrl+C to stop the server\n")

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n👋 Server stopped. Thanks for using Last.fm Recommender!")
            pass

# WSGI application for production deployment
def application(environ, start_response):
    # Set working directory to the script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    # Get the requested path
    path = environ.get('PATH_INFO', '/')
    if path == '/':
        path = '/index.html'
    
    # Handle OPTIONS requests for CORS
    if environ['REQUEST_METHOD'] == 'OPTIONS':
        headers = [
            ('Access-Control-Allow-Origin', '*'),
            ('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'),
            ('Access-Control-Allow-Headers', 'Content-Type'),
            ('Content-Type', 'text/plain')
        ]
        start_response('200 OK', headers)
        return [b'']
    
    # Try to serve the file
    try:
        file_path = os.path.join(script_dir, path.lstrip('/'))
        
        if os.path.isfile(file_path):
            # Determine content type
            content_type, _ = mimetypes.guess_type(file_path)
            if content_type is None:
                content_type = 'application/octet-stream'
            
            with open(file_path, 'rb') as f:
                content = f.read()
            
            headers = [
                ('Access-Control-Allow-Origin', '*'),
                ('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'),
                ('Access-Control-Allow-Headers', 'Content-Type'),
                ('Cache-Control', 'no-store, no-cache, must-revalidate'),
                ('Content-Type', content_type),
                ('Content-Length', str(len(content)))
            ]
            start_response('200 OK', headers)
            return [content]
        else:
            # File not found
            headers = [
                ('Access-Control-Allow-Origin', '*'),
                ('Content-Type', 'text/plain')
            ]
            start_response('404 Not Found', headers)
            return [b'File not found']
            
    except Exception as e:
        # Server error
        headers = [
            ('Access-Control-Allow-Origin', '*'),
            ('Content-Type', 'text/plain')
        ]
        start_response('500 Internal Server Error', headers)
        return [f'Error: {str(e)}'.encode()]

# For WSGI servers like Gunicorn
app = application
