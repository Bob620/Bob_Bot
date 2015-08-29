##### INPUT #####

print('----------------------------------')
print('---------Loading: input-----------')
print('----------------------------------')

import imp
import urllib.request

config = imp.new_module('config')
exec(urllib.request.urlopen('https://raw.githubusercontent.com/Bob620/Bob_Bot/master/bobbot/modules/config.py').read().decode('utf8'), config.__dict__)
Running_Modules = config.Running_Modules

class input():

	def input(Message, self):
		try:
			User = str(Message['username'].lower())
			Channel = str(Message['chatroomId'])
			Text = str(Message['text'])
			Output = Running_Modules.textParser.textparse(User, Channel, Text, self)
			if Output != '':
				return Output
		except Exception as inf:
			print("[input.input] "+str(inf))


	def command(Command, Text, User, Channel):
		# Read the file containing everything there is to know about chat
		PossibleCommands = Running_Modules.fileInteraction.readfile('Commands', 'json')
		# Build up PossibleCommands for use on this channel
		try:
			Useless = PossibleCommands['channels'][Channel]
		except Exception as inf:
			print("[input.command:1] "+str(inf))
			PossibleCommands['channels'][Channel] = {"ops":[],"commands":{},"timers":{}}
			Running_Modules.fileInteraction.writefile('commands', 'json', PossibleCommands)
		# First check for universal bot edit commands
		for ChanCommands in PossibleCommands['botedit']:
			try:
				if ChanCommands == Command:
					for Users in PossibleCommands['ops']:
						if Users == User:
							return getattr(getattr(Running_Modules, PossibleCommands['botedit'][Command].split('.')[0]), PossibleCommands['botedit'][Command].split('.')[1])(Channel, Text)
			except Exception as inf:
				print("[input.command:2] "+str(inf))
		# Look see if the command matches an edit command, then check for permission(Mod or bobbot uni mod)
		for ChanCommands in PossibleCommands['channeledit']:
			try:
				if ChanCommands == Command:
					for Users in PossibleCommands['ops']:
						if Users == User:
							return getattr(getattr(Running_Modules, PossibleCommands['channeledit'][Command].split('.')[0]), PossibleCommands['channeledit'][Command].split('.')[1])(Channel, Text)
					for Users in PossibleCommands['channels'][Channel]['ops']:
						if Users == User:
							return getattr(getattr(Running_Modules, PossibleCommands['channeledit'][Command].split('.')[0]), PossibleCommands['channeledit'][Command].split('.')[1])(Channel, Text)
			except Exception as inf:
				print("[input.command:3] "+str(inf))
		# If it's not an edit command, or an error was thrown, check for a channel command
		for Commands in PossibleCommands['channelcommands']:
			try:
				if Command == Commands:
					return getattr(getattr(Running_Modules, PossibleCommands['channelcommands'][Command].split('.')[0]), PossibleCommands['channelcommands'][Command].split('.')[1])(Channel, Text)
			except Exception as inf:
				print("[input.command:4] "+str(inf))
		# If it's not a edit command, or an error was thrown, check to see if it's a channel command
		for Commands in PossibleCommands['channels'][Channel]['commands']:
			try:
				if Command == Commands:
					return PossibleCommands['channels'][Channel]['commands'][Command]
			except Exception as inf:
				print("[input.command:5] "+str(inf))
		# If it's not a channel command, or an error was thrown again, check to see if it's a universal
		for Commands in PossibleCommands['channels']['universal']['commands']:
			try:
				if Command == Commands:
					return PossibleCommands['channels']['universal']['commands'][Command]
			except Exception as inf:
				print("[input.command:6] "+str(inf))
		# If it's not a command, well screw them but don't return anything
		return ''

print('--------------LOADED--------------')
##### ///// #####