##### INPUT #####

class input():

	Running_Modules = config.Running_Modules

	def input(Message, self):
		User = str(Message['data']['username'].lower())
		Channel = str(Message['chatroomID'])
		Text = str(Message['data']['text'])
		Output = Running_Modules.textParser.textparse(User, Channel, Text, self)
		if Output != '':
			return Output

	def command(Command, Text, User, Channel):
		# Read the file containing everything there is to know about chat
		PossibleCommands = Running_Modules.fileInteraction.readfile('Commands', 'json')
		# Build up PossibleCommands for use on this channel
		try:
			Useless = PossibleCommands['channels'][Channel]
		except:
			PossibleCommands['channels'][Channel] = {"ops":[],"commands":{},"timers":{}}
			Running_Modules.fileInteration.writefile('commands', 'json', PossibleCommands)
		# First check for universal bot edit commands
		for ChanCommands in PossibleCommands['botedit']:
			try:
				if ChanCommands == Command:
					for Users in PossibleCommands['ops']:
						if Users == User:
							return getattr(Running_Modules, PossibleCommands['botedit'][Command])(Channel, Text)
			except:
				pass
		# Look see if the command matches an edit command, then check for permission(Mod or bobbot uni mod)
		for ChanCommands in PossibleCommands['channeledit']:
			try:
				if ChanCommands == Command:
					for Users in PossibleCommands['ops']:
						if Users == User:
							return getattr(Running_Modules, PossibleCommands['channeledit'][Command])(Channel, Text)
					for Users in PossibleCommands['channels'][Channel]['ops']:
						if Users == User:
							return getattr(Running_Modules, PossibleCommands['channeledit'][Command])(Channel, Text)
			except:
				pass
		# If it's not an edit command, or an error was thrown, check for a channel command
		for Commands in PossibleCommands['channelcommands']:
			try:
				if Command == Commands:
					return getattr(Running_Modules, PossibleCommands['channelcommands'][Command])(Channel, Text)
			except:
				pass
		# If it's not a edit command, or an error was thrown, check to see if it's a channel command
		for Commands in PossibleCommands['channels'][Channel]['commands']:
			try:
				if Command == Commands:
					return PossibleCommands['channels'][Channel]['commands'][Command]
			except:
				pass
		# If it's not a channel command, or an error was thrown again, check to see if it's a universal
		for Commands in PossibleCommands['channels']['universal']['commands']:
			try:
				if Command == Commands:
					return PossibleCommands['channels']['universal']['commands'][Command]
			except:
				pass
		# If it's not a command, well screw them but don't return anything
		return ''

##### ///// #####