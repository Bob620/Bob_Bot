from socketIO_client import SocketIO, BaseNamespace
import threading
import time
import math
import random
import os
import codecs
import subprocess
import time
import random
import json

__module_name__ = "WaifuBot for Toka"
__module_version__ = "1.0"
__module_description__ = "Version 1.0"
__module_author__ = "Bob620"

class Namespace(BaseNamespace):
	
	def on_connect(self):
		print('[Connected]')
		Info = Bobbot.readfile('info', 'json')
		for Channel in Info['autoconnect']:
			Connect(Channel, Info['name'], self)
	
	def on_disconnect(self):
		print('[Disconnected]')
		Info = Bobbot.readfile('info', 'json')
		for Channel in Info['autoconnect']:
			Disconnect(Channel, Info['name'], self)
	
	def on_history(self, History):
		print('[History]')
	
	def on_viewers(self, Viewers):
		print('[Viewers]')
	
	def on_receiveMessage(self, Message):
		if Message['data']['username'].lower() != 'waifubot':
			Info = Bobbot.readfile('info', 'json')
			self.emit("sendMessage", {"username": Info['name'], "chatroomID": Message['chatroomID'], "text": Bobbot.input(Message)})







class Bobbot():
	
	def input(Message):
		User = str(Message['data']['username'].lower())
		Channel = str(Message['chatroomID'])
		Text = str(Message['data']['text'])
		Output = Bobbot.textparse(User, Channel, Text)
		if Output != '':
			return Output
	
	##### ///// #####
	##### TEXT PARSER #####
	
	# This is going to be a ride for those of you who understand it
	def textparse(User, Channel, Text):
		if Text.startswith('!'):
			TextParse = Text.split()
			if len(TextParse) >= 2:
				return Bobbot.command(TextParse.pop(0).strip('!').lower(), TextParse, User, Channel)
			else:
				return Bobbot.command(TextParse.pop(0).strip('!').lower(), '', User, Channel)
		else:
			pass
	
	##### ///// #####
	##### COMMANDS #####
	
	def command(Command, Text, User, Channel):
		# Read the file containing everything there is to know about chat
		PossibleCommands = Bobbot.readfile('Commands', 'json')
		# Build up PossibleCommands for use on this channel
		try:
			Useless = PossibleCommands['channels'][Channel]
		except:
			PossibleCommands['channels'][Channel] = {"ops":[],"commands":{}}
			Bobbot.writefile('commands', 'json', PossibleCommands)
		# First check for universal bot edit commands
		for ChanCommands in PossibleCommands['botedit']:
			try:
				if ChanCommands == Command:
					for Users in PossibleCommands['ops']:
						if Users == User:
							return getattr(Bobbot, PossibleCommands['botedit'][Command])(Channel, Text)
			except:
				pass
		# Look see if the command matches an edit command, then check for permission(Mod or bobbot uni mod)
		for ChanCommands in PossibleCommands['channeledit']:
			try:
				if ChanCommands == Command:
					for Users in PossibleCommands['ops']:
						if Users == User:
							return getattr(Bobbot, PossibleCommands['channeledit'][Command])(Channel, Text)
					for Users in PossibleCommands['channels'][Channel]['ops']:
						if Users == User:
							return getattr(Bobbot, PossibleCommands['channeledit'][Command])(Channel, Text)
			except:
				pass
		# If it's not an edit command, or na erro was thrown, check for a channel command
		for Commands in PossibleCommands['channelcommands']:
			try:
				if Command == Commands:
					return getattr(Bobbot, PossibleCommands['channelcommands'][Command])(Channel, Text)
			except:
				pass
		# If it's not a channel command, or an error was thrown, check to see if it's a channel command
		for Commands in PossibleCommands['channel'][Channel]['commands']:
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
	
	# Add a Command for said Channel
	def addcom(Channel, Text):
		try:
			if len(Text) < 2:
				return '!addcommand COMMAND-NAME COMMAND OUTPUT'
			PossibleCommands = Bobbot.readfile('Commands', 'json')
			CommandName = Text.pop(0).strip('!').lower()
			try:
				Useless = PossibleCommands['channels'][Channel]['commands'][CommandName]
				return 'Command already Exsists!'
			except:
				PossibleCommands['channels'][Channel]['commands'][CommandName] = ' '.join(Text)
				Bobbot.writefile('commands', 'json', PossibleCommands)
				return 'Created '+CommandName
		except:
			return 'An error returned during command creation! -Command most likely not created-'
	
	# Delete a Command for said Channel
	def delcom(Channel, Text):
		try:
			if len(Text) < 1:
				return '!delcommand COMMAND-NAME'
			PossibleCommands = Bobbot.readfile('Commands', 'json')
			CommandName = Text.pop(0).strip('!').lower()
			try:
				PossibleCommands['channels'][Channel]['commands'].pop(CommandName)
				Bobbot.writefile('commands', 'json', PossibleCommands)
				return 'Deleted '+CommandName
			except:
				return "That command doesn't exsist!"
		except:
			return 'An error returned duing command deletion! -Command most likely not deleted-'
	
	# Edit a Command for said Channel
	def editcom(Channel, Text):
		try:
			if len(Text) < 2:
				return '!editcommand COMMAND-NAME COMMAND OUTPUT'
			PossibleCommands = Bobbot.readfile('Commands', 'json')
			CommandName = Text.pop(0).strip('!').lower()
			try:
				Useless = PossibleCommands['channels'][Channel]['commands'][CommandName]
				PossibleCommands['channels'][Channel]['commands'][CommandName] = ' '.join(Text)
				Bobbot.writefile('commands', 'json', PossibleCommands)
				return 'Edited '+CommandName
			except:
				return "That command doesn't exsist!"
		except:
			return 'An error returned during command editing! -Command most likely not edited-'
	
	# Add a Universal Command
	def adduni(Channel, Text):
		try:
			if len(Text) < 2:
				return '!adduni COMMAND-NAME COMMAND OUTPUT'
			PossibleCommands = Bobbot.readfile('Commands', 'json')
			CommandName = Text.pop(0).strip('!').lower()
			try:
				Useless = PossibleCommands['channels']['universal']['commands'][CommandName]
				return 'Command already Exsists!'
			except:
				PossibleCommands['channels']['universal']['commands'][CommandName] = ' '.join(Text)
				Bobbot.writefile('commands', 'json', PossibleCommands)
				return 'Created '+CommandName
		except:
			return 'An error returned during command creation! -Command most likely not created-'
	
	# Delete a Universal Command
	def deluni(Channel, Text):
		try:
			if len(Text) < 1:
				return '!deluni COMMAND-NAME'
			PossibleCommands = Bobbot.readfile('Commands', 'json')
			CommandName = Text.pop(0).strip('!').lower()
			try:
				PossibleCommands['channels']['universal']['commands'].pop(CommandName)
				Bobbot.writefile('commands', 'json', PossibleCommands)
				return 'Deleted '+CommandName
			except:
				return "That command doesn't exsist!"
		except:
			return 'An error returned duing command deletion! -Command most likely not deleted-'
	
	# Edit a Universal Command
	def edituni(Channel, Text):
		try:
			if len(Text) < 2:
				return '!edituni COMMAND-NAME COMMAND OUTPUT'
			PossibleCommands = Bobbot.readfile('Commands', 'json')
			CommandName = Text.pop(0).strip('!').lower()
			try:
				Useless = PossibleCommands['channels']['universal']['commands'][CommandName]
				PossibleCommands['channels']['universal']['commands'][CommandName] = ' '.join(Text)
				Bobbot.writefile('commands', 'json', PossibleCommands)
				return 'Edited '+CommandName
			except:
				return "That command doesn't exsist!"
		except:
			return 'An error returned during command editing! -Command most likely not edited-'
	
	# Allows a mod to add more mods(Temp)
	def mod(Channel, Text):
		try:
			if len(Text) < 1:
				return '!mod NAME [NAME NAME ...]'
			PossibleCommands = Bobbot.readfile('Commands', 'json')
			NameList = ''
			for Name in Text:
				PossibleCommands['channels'][Channel]['ops'].append(Name.lower())
				NameList = NameList + Name.lower() + ', '
			Bobbot.writefile('commands', 'json', PossibleCommands)
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
			PossibleCommands = Bobbot.readfile('Commands', 'json')
			for i in range(0, len(PossibleCommands['channels'][Channel]['ops'])-1):
				if Text[0] == PossibleCommands['channels'][Channel]['ops'][i]:
					PossibleCommands['channels'][Channel]['ops'].pop(i)
			Bobbot.writefile('commands', 'json', PossibleCommands)
			return Text[0]+' has been unmodded'
		except:
			return 'An error has returned during unmodding! -Person most likely not unmodded-'
	
	# Shows the list of mods
	def modlist(Channel, Text):
		try:
			PossibleCommands = Bobbot.readfile('Commands', 'json')
			if len(PossibleCommands['channels'][Channel]['ops']) == 0:
				return 'There are no mods on this channel'
			if len(PossibleCommands['channels'][Channel]['ops']) == 1:
				return ', '.join(PossibleCommands['channels'][Channel]['ops']) + ' is the mod on this channel'
			return ', '.join(PossibleCommands['channels'][Channel]['ops']) + ' are mods on this channel'
		except:
			return "Unable to return channel's mod list!"
	
	##### ///// #####
	##### FILE INTERACTION #####
	
	# So, what I did in 300 lines can be done with json and 30 lines, Im ok with that!
	# Can read any data file that is given to it
	def readfile(FileName, Type):
		try:
			Type = Type.lower()
		except:
			Type = 'json'
		FileName = FileName.lower()
		
		if Type == 'json':
			os.chdir(r'C:/bob_bot/json/data')
			with codecs.open(FileName+'.json', 'a', encoding='utf8') as File_Make:
				pass
			with codecs.open(FileName+'.json', 'r', encoding='utf8') as File_Open:
				return json.loads(File_Open.readline())
		return ''
	
	# Can write, create, and overwrite, any data file that is given to it
	def writefile(FileName, Type, Info):
		try:
			Type = Type.lower()
		except:
			Type = 'json'
		FileName = FileName.lower()
		
		if Type == 'json':
			os.chdir(r'C:/bob_bot/json/data')
			with codecs.open(FileName+'.json', 'a', encoding='utf8') as File_Make:
				pass
			with codecs.open(FileName+'.json', 'w', encoding='utf8') as File_Open:
				File_Open.write(json.dumps(Info))
		return
	
	##### ///// #####






def Connect(Channel, Username, Chat):
	try:
		Chat.emit('join', {'username': Username, 'chatroomID': Channel})
		print('Joined Channel '+Channel)
	except:
		pass

def Disconnect(Channel, Username, Chat):
	try:
		Chat.emit('join', {'username': Username, 'chatroomID': Channel})
		print('Joined Channel '+Channel)
	except:
		return Connect(Channels, Username, Chat)





Chata = SocketIO('https://www.toka.io', 1337, Namespace, verify=True)
Chata.wait()
