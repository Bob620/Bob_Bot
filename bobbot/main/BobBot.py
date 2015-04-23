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
import pprint

__module_name__ = "BobBot V20"
__module_version__ = "20"
__module_description__ = "The 20th version of BobBot made by Bob620, I may have skipped a few numbers but it really is close to that >.>... At least every version gets better, usually."
__module_author__ = "Bob620"

global modules
modules = {"required":[], "all":[], "extra":[]}
global Running_Modules
Running_Modules = imp.new_module('Running_Modules')

def Importation(module):

	if modules['all'].count('fileInteraction') < 1:
		exec(urllib.request.urlopen('https://raw.githubusercontent.com/Bob620/Bob_Bot/master/bobbot/modules/fileInteraction.py').read().decode('utf8'), Running_Modules.__dict__)
		modules['required'].append('fileInteraction')
		modules['all'].append('fileInteraction')
	print(str(Running_Modules.fileInteraction))

	if module == 'required':
		Required_Modules = Running_Modules.fileInteraction.readfile('info', 'json')['modules']['required']
		for ModuleName in Required_Modules:
			exec(urllib.request.urlopen('https://raw.githubusercontent.com/Bob620/Bob_Bot/master/bobbot/modules/'+ModuleName+'.py').read().decode('utf8'), Running_Modules.__dict__)
			modules['all'].append(module)
			modules['required'].append(module)

	elif module == 'all':
		All_Modules = Running_Modules.fileInteraction.readfile('info', 'json')['modules']['all']
		for ModuleName in All_Modules:
			exec(urllib.request.urlopen('https://raw.githubusercontent.com/Bob620/Bob_Bot/master/bobbot/modules/'+ModuleName+'.py').read().decode('utf8'), Running_Modules.__dict__)
			modules['all'].append(module)
			if Modules['required'].count(module) >= 1:
				modules['required'].append(module)

	else:
		Modules = Running_Modules.fileInteraction.readfile('info', 'json')['modules']
		if Modules['all'].count(module) >= 1:
			exec(urllib.request.urlopen('https://raw.githubusercontent.com/Bob620/Bob_Bot/master/bobbot/modules/'+module+'.py').read().decode('utf8'), Running_Modules.__dict__)
			modules['all'].append(module)
			if Modules['required'].count(module) >= 1:
				modules['required'].append(module)

	pprint.PrettyPrinter(indent=2).pprint(modules)

Importation('all')