##### MODDING #####
# Allows a mod to add more mods(Temp)

print('----------------------------------')
print('-----------Loading: mod-----------')
print('----------------------------------')

import urllib.request
import imp

config = imp.new_module('config')
exec(urllib.request.urlopen('https://raw.githubusercontent.com/Bob620/Bob_Bot/master/bobbot/modules/config.py').read().decode('utf8'), config.__dict__)
Running_Modules = config.Running_Modules

class mod():

	def mod(Channel, Text):
		try:
			if len(Text) < 1:
				return '!mod NAME [NAME NAME ...]'
			PossibleCommands = Running_Modules.fileInteraction.readfile('Commands', 'json')
			NameList = ''
			for Name in Text:
				PossibleCommands['channels'][Channel]['ops'].append(Name.lower())
				NameList = NameList + Name.lower() + ', '
			Running_Modules.fileInteraction.writefile('commands', 'json', PossibleCommands)
			if len(Text) == 1:
				return NameList.strip(', ')+' has been modded!'
			return NameList.strip(', ')+' have been modded!'
		except Exception as inf:
			print(inf)
			return 'An error returned during modding! -Person/People most likely not modded-'
	
	# Allows a mod to remove other mods(Temp)
	def unmod(Channel, Text):
		try:
			if len(Text) < 1:
				return '!unmod NAME'
			PossibleCommands = Running_Modules.fileInteraction.readfile('Commands', 'json')
			for i in range(0, len(PossibleCommands['channels'][Channel]['ops'])-1):
				if Text[0] == PossibleCommands['channels'][Channel]['ops'][i]:
					PossibleCommands['channels'][Channel]['ops'].pop(i)
			Running_Modules.fileInteraction.writefile('commands', 'json', PossibleCommands)
			return Text[0]+' has been unmodded'
		except:
			return 'An error has returned during unmodding! -Person most likely not unmodded-'
	
	# Shows the list of mods
	def modlist(Channel, Text):
		try:
			PossibleCommands = Running_Modules.fileInteraction.readfile('Commands', 'json')
			if len(PossibleCommands['channels'][Channel]['ops']) == 0:
				return 'There are no mods on this channel'
			if len(PossibleCommands['channels'][Channel]['ops']) == 1:
				return ', '.join(PossibleCommands['channels'][Channel]['ops']) + ' is the mod on this channel'
			return ', '.join(PossibleCommands['channels'][Channel]['ops']) + ' are mods on this channel'
		except:
			return "Unable to return channel's mod list!"

print('--------------LOADED--------------')
##### ///// #####