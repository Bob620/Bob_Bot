##### TEXT PARSER #####

# This is going to be a ride for those of you who understand it

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