##### TIMER BACKGROUND #####

print('----------------------------------')
print('-----Loading: timerBackground-----')
print('----------------------------------')

import sys
import urllib.request
import imp
import time

config = imp.new_module('config')
exec(urllib.request.urlopen('https://raw.githubusercontent.com/Bob620/Bob_Bot/master/bobbot/modules/config.py').read().decode('utf8'), config.__dict__)
Running_Modules = config.Running_Modules

class timerBackground():

	def run(self):
		i = 0
		while 1:
			time.sleep(1)
			i = i+1
			PossibleCommands = Running_Modules.fileInteraction.readfile("commands", "json")['channels']
			Info = Running_Modules.fileInteraction.readfile('info', 'json')
			for Channel in PossibleCommands.keys():
				if Channel != 'universal':
					for timer in PossibleCommands[Channel]['timers'].keys():
						if PossibleCommands[Channel]['timers'][timer]['active']:
							if (PossibleCommands[Channel]['timers'][timer]['delay']/i).is_integer():
								self.emit("sendMessage", {"username": Info['autoconnect'][chatroomID], "chatroomID": Channel, "text": PossibleCommands[Channel]['timers'][timer]['text']})


	def activate(Channel, Text):
		PossibleTimers = Running_Modules.fileInteraction.readfile("commands", "json")['channels'][Channel]['timers']
		if PossibleTimers.count(Text[0].lower()):
			if PossibleTimers['active'] == False:
				PossibleTimers['active'] = True
			else:
				return "That timer is already on!"	

	def deactivate(Channel, Text):
		PossibleTimers = Running_Modules.fileInteraction.readfile("commands", "json")['channels'][Channel]['timers']
		if PossibleTimers.count(Text[0].lower()):
			if PossibleTimers['active'] == True:
				PossibleTimers['active'] = False
			else:
				return "That timer is already off!"

print('--------------LOADED--------------')
##### ///// #####