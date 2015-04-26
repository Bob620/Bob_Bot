##### COMMANDS #####

class commands():

	Running_Modules = config.Running_Modules

	def timers(Channel, Text):
		try:
			PossibleCommands = Running_Modules.fileInteration.readfile('Commands', 'json')
			return "Timers on this channel are: "+', '.join(list(PossibleCommands['channels'][Channel]['timers']))+'\nUse !testtimer TIMER-NAME to show output and how often it occurs'
		except:
			return "An error returned while finding the timer list, please try again later!"
	
	def testtimer(Channel, Text):
		try:
			PossibleCommands = Running_Modules.fileInteration.readfile('Commands', 'json')
			Command = Text[0]
			for Commands in PossibleCommands['channels'][Channel]['timers']:
				try:
					if Command == Commands:
						return '-- '+Command+' --\nHow Often: '+str(PossibleCommands['channels'][Channel]['timers'][Command]['delay'])+' Seconds\nOutput: '+PossibleCommands['channels'][Channel]['timers'][Command]['text']+'\n Currently Active: '+str(PossibleCommands['channels'][Channel]['timers'][Command]['active'])
				except:
					return "An error returned while running the test, please try again later!"
			return "Could not find that timer!"
		except:
			return "An error returned while running the test, please try again later!"

	# Display all possible commands for the channel
	def commands(Channel, Text):
		try:
			PossibleCommands = Running_Modules.fileInteraction.readfile('Commands', 'json')
			CommandList = []
			CommandListFinal = collections.Counter()
			for Command in list(PossibleCommands['channels'][Channel]['commands']):
				CommandList.append('!'+Command)
			for Command in list(PossibleCommands['channels']['universal']['commands']):
				CommandList.append('!'+Command)
			for Command in CommandList:
				CommandListFinal[Command] += 1
			return "Commands on this channel are: "+', '.join(list(CommandListFinal))
		except:
			return "An Error Occured while retrieving commands, please try again later!"

##### ///// #####