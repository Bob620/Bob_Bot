##### FILE INTERACTION #####
# So, what I did in 300 lines can be done with json and 30 lines, Im ok with that!
# Only edits and reads the Info found locally for specifics such as 'personal' info and just about anything else
# Can read any data file that is given to it
import imp
import urllib.request

print('----------------------------------')
print('-----Loading: fileInteraction-----')
print('----------------------------------')

import os
import codecs
import json

config = imp.new_module('config')
exec(urllib.request.urlopen('https://raw.githubusercontent.com/Bob620/Bob_Bot/master/bobbot/modules/config.py').read().decode('utf8'), config.__dict__)
Running_Modules = config.Running_Modules

class fileInteraction():

	def readfile(FileName, Type):
		try:
			Type = Type.lower()
		except:
			Type = 'json'
		try:
			FileName = FileName.lower()
			
			if Type == 'json':
				os.chdir(r'C:/bob_bot/json/data')
				with codecs.open(FileName+'.json', 'a', encoding='utf8') as File_Make:
					pass
				with codecs.open(FileName+'.json', 'r', encoding='utf8') as File_Open:
					File = File_Open.readline()
					if File != '':
						return json.loads(File)
					else:
						return {}
		except Exception as inf:
			print(inf)
			return ''

	# Can write, create, and overwrite, any data file that is given to it
	def writefile(FileName, Type, Info):
		try:
			Type = Type.lower()
		except:
			Type = 'json'
		try:
			FileName = FileName.lower()
			
			if Type == 'json':
				os.chdir(r'C:/bob_bot/json/data')
				with codecs.open(FileName+'.json', 'a', encoding='utf8') as File_Make:
					pass
				with codecs.open(FileName+'.json', 'w', encoding='utf8') as File_Open:
						File_Open.write(json.dumps(Info))
			return
		except Exception as inf:
			print(inf)
			return

print('--------------LOADED--------------')

##### ///// #####