from socketIO_client import SocketIO, BaseNamespace
import threading
import time
import math
import random
import os
import codecs
import subprocess
import time
import random
import json
import importlib
import sys
import re
import collections
import irc
import urllib.request
import imp

fileInteraction = imp.new_module('fileInteraction')
exec(urllib.request.urlopen('https://raw.githubusercontent.com/Bob620/Bob_Bot/master/bobbot/modules/fileInteraction.py').read().decode('utf8'), fileInteraction.__dict__)


__module_name__ = "WaifuBot for Toka"
__module_version__ = "1.0"
__module_description__ = "Version 1.0"
__module_author__ = "Bob620"