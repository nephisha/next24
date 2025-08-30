#!/usr/bin/env python3
"""
Simple HTTP server to serve the test frontend HTML file
This avoids CORS issues with file:// protocol
"""

import http.server
import socketserver
import webbrowser
import os

PORT = 3001


class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        super().end_headers()


if __name__ == "__main__":
    # Change to the directory containing the HTML file
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"🚀 Test frontend server running at http://localhost:{PORT}")
        print(f"📂 Serving files from: {os.getcwd()}")
        print(f"🌐 Open http://localhost:{PORT}/test_frontend.html in your browser")
        print("Press Ctrl+C to stop the server")

        # Automatically open the browser
        webbrowser.open(f"http://localhost:{PORT}/test_frontend.html")

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n👋 Server stopped")
