#!/usr/bin/python

import sys
import json

data = ""
for line in sys.stdin:
    data += line
    pass


js = json.loads(data);

print js
