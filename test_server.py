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
    
BATCH_DELTA = 3 # How many batches to show before + after current batch

# Translations from dateinput formatting to Python formatting
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

        if 'batch_size' in data:
            batch_size = int(data['batch_size'][0])
        else:
            batch_size = 10        
            
        if 'start' in data:
            start = int(data['start'][0])
        else:
            start = 0
        cur_batch = start // batch_size
        start = cur_batch * batch_size # Avoid stupid start-values
        
        for x in range(start):
            try:
                iterator.next()
            except StopIteration:
                break
        
        occurrences = []
        for x in range(batch_size):
            try:
                date = iterator.next()
            except StopIteration:
                break
            # TODO: change status if it's an RDATE
            occurrences.append({'date': date.strftime('%Y-%m-%d'),
                                'formatted_date': date.strftime(date_format),
                                'type': 'rrule',})
        
        # Calculate no of occurrences, but only to a max of three times
        # the batch size. This will support infinite recurrance in a
        # useable way, as there will always be more batches.        
        first_batch = max(0, cur_batch - BATCH_DELTA)
        last_batch = max(BATCH_DELTA * 2, cur_batch + BATCH_DELTA)
        maxcount = (batch_size * last_batch) - start
        
        num_occurrences = 0
        while True:
            try:
                iterator.next()
                num_occurrences += 1
            except StopIteration:
                break
            if num_occurrences >= maxcount:
                break
        
        # Total number of occurrences:
        num_occurrences += batch_size + start
        
        max_batch = (num_occurrences - 1)//batch_size
        if last_batch > max_batch:
            last_batch = max_batch
            first_batch = max(0, max_batch - (BATCH_DELTA * 2))
                
        batches = [((x * batch_size) + 1, (x + 1) * batch_size) for x in range(first_batch, last_batch + 1)]
        batch_data = {'start': start,
                      'end': num_occurrences,
                      'batch_size': batch_size,
                      'batches': batches,
                      'current_batch': cur_batch - first_batch,
                      }
                
        # TODO: Add exdates
            
        result = {'occurrences': occurrences, 'batch': batch_data}
        self.wfile.write(json.dumps(result))


httpd = SocketServer.TCPServer(("", port), Handler)
print "serving at port", port
httpd.serve_forever()
