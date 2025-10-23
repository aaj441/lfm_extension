#!/usr/bin/env python3
"""
Simple HTTP server for testing Last.fm Recommender
Run with: python3 server.py
Then open: http://localhost:8000
"""

import http.server
import socketserver
import os

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
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

with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
    print(f"\n🎵 Last.fm Recommender Server Running!")
    print(f"📱 Open in your browser: http://localhost:{PORT}")
    print(f"💻 Or access from phone: http://[your-local-ip]:{PORT}")
    print(f"\n✋ Press Ctrl+C to stop the server\n")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n👋 Server stopped. Thanks for using Last.fm Recommender!")
        pass
