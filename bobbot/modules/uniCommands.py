##### UNIVERSAL COMMANDS #####
# This file'll be home to the commands to interact with universal commands.
# It'll contain adduni, edituni, and deluni to allow universal mods to
# create, edit, and delete universal commands.

print('--------------------------------')
print('------Loading: uniCommands------')
print('--------------------------------')

class uniCommands():

	# Add a Universal Command
	def adduni(Channel, Text):
		try:
			if len(Text) < 2:
				return '!adduni COMMAND-NAME COMMAND OUTPUT'
			PossibleCommands = Running_Moddules.fileInteraction.readfile('Commands', 'json')
			CommandName = Text.pop(0).strip('!').lower()
			try:
				Useless = PossibleCommands['channels']['universal']['commands'][CommandName]
				return 'Command already Exsists!'
			except:
				PossibleCommands['channels']['universal']['commands'][CommandName] = ' '.join(Text)
				Running_Moddules.fileInteraction.writefile('commands', 'json', PossibleCommands)
				return 'Created '+CommandName
		except:
			return 'An error returned during command creation! -Command most likely not created-'

	# Edit a Universal Command
	def edituni(Channel, Text):
		try:
			if len(Text) < 2:
				return '!edituni COMMAND-NAME COMMAND OUTPUT'
			PossibleCommands = Running_Moddules.fileInteraction.readfile('Commands', 'json')
			CommandName = Text.pop(0).strip('!').lower()
			try:
				Useless = PossibleCommands['channels']['universal']['commands'][CommandName]
				PossibleCommands['channels']['universal']['commands'][CommandName] = ' '.join(Text)
				Running_Moddules.fileInteraction.writefile('commands', 'json', PossibleCommands)
				return 'Edited '+CommandName
			except:
				return "That command doesn't exsist!"
		except:
			return 'An error returned during command editing! -Command most likely not edited-'

	# Delete a Universal Command
	def deluni(Channel, Text):
		try:
			if len(Text) < 1:
				return '!deluni COMMAND-NAME'
			PossibleCommands = Running_Moddules.fileInteraction.readfile('Commands', 'json')
			CommandName = Text.pop(0).strip('!').lower()
			try:
				PossibleCommands['channels']['universal']['commands'].pop(CommandName)
				Running_Moddules.fileInteraction.writefile('commands', 'json', PossibleCommands)
				return 'Deleted '+CommandName
			except:
				return "That command doesn't exsist!"
		except:
			return 'An error returned during command deletion! -Command most likely not deleted-'


print('-------------LOADED-------------')

##### ///// #####