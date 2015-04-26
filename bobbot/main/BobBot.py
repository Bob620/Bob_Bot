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

##### Modules #####
# This bit will make sure everything can call the module lists

# When called, Importation will load the selected module, or lists of modules, and load each one, If the module is already loaded
# it will then reaload the module in the same fasion it would load ne normally. Once loaded the module's name will be logged in
# the loaded/running module list.
try:
	global modules
	modules = {"required":[], "all":[], "extra":[]}
	global Running_Modules
	Running_Modules = imp.new_module('Running_Modules')
except Exception as inf:
	print(inf)
	print('----------------------------------')
	sys.exit('001 - Unable to set global variables "modules" and "Running_Modules"')

def Importation(module):

	try:
		if modules['all'].count('fileInteraction') < 1:
			exec(urllib.request.urlopen('https://raw.githubusercontent.com/Bob620/Bob_Bot/master/bobbot/modules/fileInteraction.py').read().decode('utf8'), Running_Modules.__dict__)
			modules['required'].append('fileInteraction')
			modules['all'].append('fileInteraction')

		if module == 'fileInteraction':
			print('')
			print('---------------LOAD---------------')
			pprint.PrettyPrinter(indent=2).pprint(modules)
			print('----------------------------------')
			print('')
			return

		if module == 'required':
			Required_Modules = Running_Modules.fileInteraction.readfile('info', 'json')['modules']['required']
			for ModuleName in Required_Modules:
				exec(urllib.request.urlopen('https://raw.githubusercontent.com/Bob620/Bob_Bot/master/bobbot/modules/'+ModuleName+'.py').read().decode('utf8'), Running_Modules.__dict__)
				modules['all'].append(ModuleName)
				modules['required'].append(ModuleName)

		elif module == 'all':
			Modules_List = Running_Modules.fileInteraction.readfile('info', 'json')['modules']
			for ModuleName in Modules_List['all']:
				exec(urllib.request.urlopen('https://raw.githubusercontent.com/Bob620/Bob_Bot/master/bobbot/modules/'+ModuleName+'.py').read().decode('utf8'), Running_Modules.__dict__)
				modules['all'].append(ModuleName)
				if Modules_List['required'].count(module) > 1:
					modules['required'].append(ModuleName)

		else:
			Modules_List = Running_Modules.fileInteraction.readfile('info', 'json')['modules']
			if Modules_List['all'].count(module) < 1:
				exec(urllib.request.urlopen('https://raw.githubusercontent.com/Bob620/Bob_Bot/master/bobbot/modules/'+module+'.py').read().decode('utf8'), Running_Modules.__dict__)
				modules['all'].append(ModuleName)
				if Modules_List['required'].count(module) > 1:
					modules['required'].append(ModuleName)

	except Exception as inf:
		print(inf)

	try:
		print('')
		print('---------------LOAD---------------')
		pprint.PrettyPrinter(indent=2).pprint(modules)
		print('----------------------------------')
		print('')
	except Exception as inf:
		print(str(inf))

def Deimportation(module):

	try:
		if modules['all'].count('fileInteraction') < 1:
			exec(urllib.request.urlopen('https://raw.githubusercontent.com/Bob620/Bob_Bot/master/bobbot/modules/fileInteraction.py').read().decode('utf8'), Running_Modules.__dict__)
			modules['required'].append('fileInteraction')
			modules['all'].append('fileInteraction')
		Modules_List = Running_Modules.fileInteraction.readfile('info', 'json')['modules']

		if module == 'all':
			print('----------------------------------')
			for ModuleName in Modules_List['all']:
				print('----Unloading: '+ModuleName+'----')
				del Running_Modules.__dict__[ModuleName]
				modules['all'].remove(ModuleName)
				if Modules_List['required'].count(module) > 1:
					modules['required'].remove(ModuleName)
			print('----------------------------------')


		else:
			if modules['all'].count(module) >= 1:
				print('----------------------------------')
				print('----Unloading: '+module+'----')
				print('----------------------------------')
				del Running_Modules.__dict__[module]
				modules['all'].remove(module)
				if Modules_List['required'].count(module) < 1:
					modules['required'].remove(module)

	except Exception as inf:
		print(str(inf))

	try:
		print('')
		print('--------------UNLOAD--------------')
		pprint.PrettyPrinter(indent=2).pprint(modules)
		print('----------------------------------')
		print('')
	except Exception as inf:
		print(str(inf))

## Import everything ##
Importation('all')
## UnImport fileInteraction for a load test ##
Deimportation('fileInteraction')
## Re-import just incase ##
Importation('fileInteraction')

##### ///// #####

#Chata = SocketIO('http://www.bobco.moe', 1337, Namespace, verify=True)
Chata = SocketIO('https://chata.toka.io', 1337, Running_Modules.tokaNamespace.tokaNamespace, verify=True)
Chata.wait()





