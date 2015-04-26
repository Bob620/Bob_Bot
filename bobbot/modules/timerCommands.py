##### TIMER COMMANDS #####
# Like the other ___Commands files, this will have the commands addtimer, edittimer, and deltimer.
# However the other commands timers and testtimer will be located with the commands command found
# in the commands.py file.

print('----------------------------------')
print('------Loading: timerCommands------')
print('----------------------------------')

class timerCommands():

	Running_Modules = config.Running_Modules

	# Add a Channel specific Timer
	def addtimer(Channel, Text):
		try:
			if len(Text) < 3:
				return '!addtimer TIMER-NAME HOW-OFTEN-SECONDS TIMER OUTPUT'
			try:
				Text[1] = float(Text[1])
				Text[1] = int(Text[1])
			except:
				try:
					Text[1] = int(Text[1])
				except:
					return '!addtimer TIMER-NAME HOW-OFTEN-SECONDS TIMER OUTPUT'
			PossibleCommands = Running_Modules.fileInteraction.readfile('Commands', 'json')
			CommandName = Text.pop(0).strip('!').lower()
			try:
				Useless = PossibleCommands['channels']['universal']['timers'][CommandName]
				return 'Timer already Exsists!'
			except:
				PossibleCommands['channels'][Channel]['timers'][CommandName] = {"delay":Text.pop(0),"text":' '.join(Text),"active":False}
				Running_Modules.fileInteraction.writefile('commands', 'json', PossibleCommands)
				return 'Created '+CommandName
		except Exception as inf:
			print(str(inf))
			return 'An error returned during timer creation! -Timer most likely not created-'

	# Edit a Channel specific Timer
	def edittimer(Channel, Text):
		try:
			if len(Text) < 2:
				return '!edituni TIMER-NAME HOW-OFTEN-SECONDS(Optional) TIMER OUTPUT'
			PossibleCommands = Running_Modules.fileInteraction.readfile('Commands', 'json')
			CommandName = Text.pop(0).strip('!').lower()
			try:
				Useless = PossibleCommands['channels'][Channel]['timers'][CommandName]
				try:
					Delay = float(Text[0])
					Delay = int(Text[0])
					Useless = Text.pop(0)
				except:
					try:
						Delay = int(Text[0])
						Useless = Text.pop(0)
					except:
						Delay = Useless['delay']
				PossibleCommands['channels'][Channel]['timers'][CommandName]['text'] = ' '.join(Text)
				PossibleCommands['channels'][Channel]['timers'][CommandName]['delay'] = Delay
				Running_Modules.fileInteraction.writefile('commands', 'json', PossibleCommands)
				return 'Edited '+CommandName
			except:
				return "That timer doesn't exsist!"
		except:
			return 'An error returned during timer editing! -Timer most likely not edited-'

	# Delete a Channel specific Timer
	def deltimer(Channel, Text):
		try:
			if len(Text) < 1:
				return '!deltimer TIMER-NAME'
			PossibleCommands = Running_Modules.fileInteraction.readfile('Commands', 'json')
			CommandName = Text.pop(0).strip('!').lower()
			try:
				PossibleCommands['channels'][Channel]['timers'].pop(CommandName)
				Running_Modules.fileInteraction.writefile('commands', 'json', PossibleCommands)
				return 'Deleted '+CommandName
			except:
				return "That timer doesn't exsist!"
		except:
			return 'An error returned during timer deletion! -Timer most likely not deleted-'

print('--------------LOADED--------------')

##### ///// #####