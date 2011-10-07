#!/usr/bin/env python

import sys
import SimpleHTTPServer
import SocketServer

if len(sys.argv) > 1:
    port = int(sys.argv[1])
else:
    port = 8000

class Handler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    """The test example handler."""

    def do_POST(self):
        """Handle a post request by returning the square of the number."""
        import pdb;pdb.set_trace()
        length = int(self.headers.getheader('content-length'))        
        data_string = self.rfile.read(length)
        try:
            result = int(data_string) ** 2
        except:
            result = 'error'
        self.wfile.write(result)


httpd = SocketServer.TCPServer(("", port), Handler)

print "serving at port", port
httpd.serve_forever()
