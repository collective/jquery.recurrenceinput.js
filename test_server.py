#!/usr/bin/env python

import sys
import SimpleHTTPServer
import SocketServer
import urlparse
import datetime
from dateutil import rrule
import json
import re

if len(sys.argv) > 1:
    port = int(sys.argv[1])
else:
    port = 8000
    
# Translations from dateinput formatting to Python formatting
import re

DATEFORMAT_XLATE = [
    (re.compile(pattern), replacement) for (pattern, replacement) in (
        ('dddd', '%A'),
        ('ddd', '%a'),
        ('dd', '%d'),
        ('!%d', '%e'), # Will include a leading space for 1-9
        ('mmmm', '%B'),
        ('mmm', '%b'),
        ('mm', '%m'),
        ('!%m', '%m'), # Will include leading zero
        ('yyyy', '%Y'),
        ('yy', '%y'),
    )
]

def dateformat_xlate(dateformat):
    for regexp, replacement in DATEFORMAT_XLATE:
        dateformat = regexp.sub(replacement, dateformat)
    return dateformat
    
class Handler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    """The test example handler."""

    def do_POST(self):
        """Handle a post request by returning the square of the number."""
        # TODO: Return error on failure
        occurrences = []
        length = int(self.headers.getheader('content-length'))
        data_string = self.rfile.read(length)
        data = urlparse.parse_qs(data_string)
        # Check for required parameters:
        for x in ('year', 'month', 'day', 'rrule', 'format'):
            assert x in data
        
        date_format = dateformat_xlate(data['format'][0])        
        start_date = datetime.datetime(int(data['year'][0]),
                                       int(data['month'][0]),
                                       int(data['day'][0]))
        rule = rrule.rrulestr(data['rrule'][0], dtstart=start_date)
        iterator = iter(rule)
        #import pdb;pdb.set_trace()
        if 'start' in data:
            for x in range(data):
                try:
                    iterator.next()
                except StopIteration:
                    break
        
        occurrences = []
        for x in range(10):
            try:
                date = iterator.next()
            except StopIteration:
                break
            # TODO: change status if it's an RDATE
            occurrences.append({'date': date.strftime('%Y-%m-%d'),
                                'formatted_date': date.strftime(date_format),
                                'status': 'rule',})
        
        # TODO: Calculate no of occurrences (unless infinite)
        # TODO: Add exdates
            
        result = {'occurrences': occurrences}
        self.wfile.write(json.dumps(result))


httpd = SocketServer.TCPServer(("", port), Handler)
print "serving at port", port
httpd.serve_forever()
