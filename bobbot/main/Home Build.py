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
	print("[MAIN.GLOBAL] "+str(inf))
	print('----------------------------------')
	sys.exit('001 - Unable to set global variables "modules" and/or "Running_Modules"')

def Importation(module):

	try:
		if modules['all'].count('fileInteraction') < 1:
			with codecs.open('C:/Users/Noah/Desktop/Bob_bot2.0/Github/Bob_Bot/bobbot/modules/fileInteraction.py', 'r', encoding='utf8') as File_Open:
				File = File_Open.readlines()
				exec(''.join(File), Running_Modules.__dict__)
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
				try:
					with codecs.open('C:/Users/Noah/Desktop/Bob_bot2.0/Github/Bob_Bot/bobbot/modules/'+ModuleName+'.py', 'r', encoding='utf8') as File_Open:
						File = File_Open.readlines()
						exec(''.join(File), Running_Modules.__dict__)
					modules['all'].append(ModuleName)
					modules['required'].append(ModuleName)
				except Exception as inf:
					print(''.join(File))
					print(str(inf))

		elif module == 'all':
			Modules_List = Running_Modules.fileInteraction.readfile('info', 'json')['modules']
			for ModuleName in Modules_List['all']:
				try:
					with codecs.open('C:/Users/Noah/Desktop/Bob_bot2.0/Github/Bob_Bot/bobbot/modules/'+ModuleName+'.py', 'r', encoding='utf8') as File_Open:
						File = File_Open.readlines()
						exec(''.join(File), Running_Modules.__dict__)
					modules['all'].append(ModuleName)
					if Modules_List['required'].count(module) > 1:
						modules['required'].append(ModuleName)
				except Exception as inf:
					print(''.join(File))
					print(str(inf))

		else:
			Modules_List = Running_Modules.fileInteraction.readfile('info', 'json')['modules']
			if Modules_List['all'].count(module) < 1:
				try:
					with codecs.open('C:/Users/Noah/Desktop/Bob_bot2.0/Github/Bob_Bot/bobbot/modules/'+ModuleName+'.py', 'r', encoding='utf8') as File_Open:
						File = File_Open.readlines()
						exec(''.join(File), Running_Modules.__dict__)
					modules['all'].append(ModuleName)
					if Modules_List['required'].count(module) > 1:
						modules['required'].append(ModuleName)
				except Exception as inf:
					print(''.join(File))
					print(str(inf))

	except Exception as inf:
		print("[MAIN.Importation] "+str(inf))

	try:
		print('')
		print('---------------LOAD---------------')
		pprint.PrettyPrinter(indent=2).pprint(modules)
		print('----------------------------------')
		print('')
	except Exception as inf:
		print("[MAIN.Importation:end] "+str(inf))


def Deimportation(module):

	try:
		if modules['all'].count('fileInteraction') < 1:
			with codecs.open('C:/Users/Noah/Desktop/Bob_bot2.0/Github/Bob_Bot/bobbot/modules/fileInteraction.py', 'r', encoding='utf8') as File_Open:
				File = File_Open.readlines()
				exec(''.join(File), Running_Modules.__dict__)
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
		print("[MAIN.Deimportation] "+str(inf))

	try:
		print('')
		print('--------------UNLOAD--------------')
		pprint.PrettyPrinter(indent=2).pprint(modules)
		print('----------------------------------')
		print('')
	except Exception as inf:
		print("[MAIN.Deimportation:end] "+str(inf))

## Import everything ##
Importation('all')
## UnImport fileInteraction for a load test ##
Deimportation('fileInteraction')
## Re-import just incase ##
Importation('fileInteraction')

##### ///// #####

Running_Modules.Running_Modules = Running_Modules
#Chata = SocketIO('http://www.bobco.moe', 1337, Namespace, verify=True)
#Chata = SocketIO('https://dev.toka.io', 1337, Running_Modules.tokaNamespace, verify=True)
#Chata = SocketIO('https://chata.toka.io', 1337, Running_Modules.tokaNamespace, verify=True)
Chata = SocketIO('https://toka.io', 1337, Running_Modules.tokaNamespace, verify=True)
Chata.wait()