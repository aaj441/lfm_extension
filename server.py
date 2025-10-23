#!/usr/bin/env python3
"""
HTTP server for Last.fm Recommender
Supports both local development and Railway deployment
"""

import http.server
import socketserver
import os

# Use Railway's PORT environment variable, fallback to 8000 for local dev
PORT = int(os.environ.get('PORT', 8000))

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

    def log_message(self, format, *args):
        # Log requests for debugging
        print(f"[{self.log_date_time_string()}] {format % args}")

# Change to script directory
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Bind to 0.0.0.0 to accept connections from any network interface (required for Railway)
with socketserver.TCPServer(("0.0.0.0", PORT), MyHTTPRequestHandler) as httpd:
    print(f"\n🎵 Last.fm Recommender Server Running!")
    print(f"📱 Listening on port: {PORT}")
    if PORT == 8000:
        print(f"🔗 Local: http://localhost:{PORT}")
        print(f"💻 Network: http://[your-local-ip]:{PORT}")
    else:
        print(f"☁️  Railway deployment mode")
    print(f"\n✋ Press Ctrl+C to stop the server\n")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n👋 Server stopped. Thanks for using Last.fm Recommender!")
        pass
