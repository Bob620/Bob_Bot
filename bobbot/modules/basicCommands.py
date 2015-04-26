##### BASIC COMMANDS #####
# This file'll be home to everything that will directly interact with basic commands.
# That means that this will include Addcom, Delcom, and Editcom for the sake of 
# making fewer files, if the commands need to be I can seperate them later but that may break module stuff...

print('----------------------------------')
print('------Loading: basicCommands------')
print('----------------------------------')

class basicCommands():

	Running_Modules = config.Running_Modules

	# Add a Command on a specified Channel
	def addcom(Channel, Text):
		try:
			if len(Text) < 2:
				return '!addcommand COMMAND-NAME COMMAND OUTPUT'
			PossibleCommands = Running_Modules.fileInteraction.readfile('Commands', 'json')
			CommandName = Text.pop(0).strip('!').lower()
			try:
				Useless = PossibleCommands['channels'][Channel]['commands'][CommandName]
				return 'Command already Exsists!'
			except:
				PossibleCommands['channels'][Channel]['commands'][CommandName] = ' '.join(Text)
				Running_Modules.fileInteraction.writefile('commands', 'json', PossibleCommands)
				return 'Created '+CommandName
		except:
			return 'An error returned during command creation! -Command most likely not created-'

	# Edit a Command on a specified Channel
	def editcom(Channel, Text):
		try:
			if len(Text) < 1:
				return '!delcommand COMMAND-NAME [COMMAND-NAME-TWO ETC.]'
			for Command in Text:
				PossibleCommands = Running_Modules.fileInteraction.readfile('Commands', 'json')
				CommandName = Command.strip('!').lower()
				try:
					PossibleCommands['channels'][Channel]['commands'].pop(CommandName)
					Running_Modules.fileInteraction.writefile('commands', 'json', PossibleCommands)
				except:
					return "That command doesn't exsist!"
			return 'Deleted '+', '.join(Text)
		except:
			return 'An error returned duing command deletion! -Command most likely not deleted-'

	# Delete a Command on a specified Channel
	def delcom(Channel, Text):
		try:
			if len(Text) < 2:
				return '!editcommand COMMAND-NAME COMMAND OUTPUT'
			PossibleCommands = Running_Modules.fileInteraction.readfile('Commands', 'json')
			CommandName = Text.pop(0).strip('!').lower()
			try:
				Useless = PossibleCommands['channels'][Channel]['commands'][CommandName]
				PossibleCommands['channels'][Channel]['commands'][CommandName] = ' '.join(Text)
				Running_Modules.fileInteraction.writefile('commands', 'json', PossibleCommands)
				return 'Edited '+CommandName
			except:
				return "That command doesn't exsist!"
		except:
			return 'An error returned during command editing! -Command most likely not edited-'

print('--------------LOADED--------------')
##### ///// #####