#!/usr/bin/env python

import sys
import SimpleHTTPServer
import SocketServer
import urlparse
import datetime
from dateutil import rrule
import json

if len(sys.argv) > 1:
    port = int(sys.argv[1])
else:
    port = 8000

class Handler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    """The test example handler."""

    def do_POST(self):
        """Handle a post request by returning the square of the number."""
        occurrences = []
        length = int(self.headers.getheader('content-length'))
        data_string = self.rfile.read(length)
        data = urlparse.parse_qs(data_string)
        if 'year' in data and 'month' in data and 'day' in data and 'rrule' in data:
            start_date = datetime.datetime(int(data['year'][0]),
                                           int(data['month'][0]),
                                           int(data['day'][0]))
            rule = rrule.rrulestr(data['rrule'][0], dtstart=start_date)
            occurrences = [x.strftime('%Y-%m-%d') for x in rule]
        
        result = json.dumps({'occurrences': occurrences})
        self.wfile.write(result)


httpd = SocketServer.TCPServer(("", port), Handler)
print "serving at port", port
httpd.serve_forever()
