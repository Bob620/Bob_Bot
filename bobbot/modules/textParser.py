##### TEXT PARSER #####

# This is going to be a ride for those of you who understand it

config = imp.new_module('config')
exec(urllib.request.urlopen('https://raw.githubusercontent.com/Bob620/Bob_Bot/master/bobbot/modules/config.py').read().decode('utf8'), config.__dict__)
Running_Modules = config.Running_Modules

class textParser():

	def textparse(User, Channel, Text, self):
		Info = Running_Modules.fileInteraction.readfile('info', 'json')
		OwnName = Info['name']
		# Basic Commands
		if Text.startswith('!'):
			TextParse = Text.split()
			if len(TextParse) >= 2:
				return Running_Modules.input.command(TextParse.pop(0).strip('!').lower(), TextParse, User, Channel)
			else:
				return Running_Modules.input.command(TextParse.pop(0).strip('!').lower(), '', User, Channel)