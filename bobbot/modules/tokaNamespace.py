##### TOKANAMESPACE #####

print('----------------------------------')
print('------Loading: tokaNamespace------')
print('----------------------------------')

from socketIO_client import SocketIO, BaseNamespace
import imp
import urllib.request
import threading

config = imp.new_module('config')
exec(urllib.request.urlopen('https://raw.githubusercontent.com/Bob620/Bob_Bot/master/bobbot/modules/config.py').read().decode('utf8'), config.__dict__)
Running_Modules = config.Running_Modules

class tokaNamespace(BaseNamespace):

	BobBot = ''
	CurrentMoodType = ''
	
	def on_connect(self):
		try:
			print('[Connected]')
			Info = Running_Modules.fileInteraction.readfile('info', 'json')
			for Channel in Info['autoconnect'].keys():
				Running_Modules.toka.Connect(Channel, Info['autoconnect'][Channel], self)
			#Timers = threading.Thread(target=Running_Modules.timerBackground.run(self))
			#Timers.run()
		except Exception as inf:
			print("[tokaNamespace.on_connect] "+str(inf))

	
	def on_disconnect(self):
		try:
			print('[Disconnected]')
			Info = Running_Modules.fileInteraction.readfile('info', 'json')
			for Channel in Info['autoconnect'].keys():
				Running_Modules.toka.Disconnect(Channel, Info['autoconnect'][Channel], self)
		except Exception as inf:
			print("[tokaNamespace.on_disconnect] "+str(inf))

	
	def on_history(self, History):
		try:
			print('[History]')
		except Exception as inf:
			print("[tokaNamespace.on_history] "+str(inf))

	
	def on_viewers(self, Viewers):
		try:
			print('[Viewers]')
		except Exception as inf:
			print("[tokaNamespace.on_viewers] "+str(inf))

	
	def on_receiveMessage(self, Message):
		try:
			if Message['username'].lower() != 'waifubot':
				Info = Running_Modules.fileInteraction.readfile('info', 'json')
				t = threading.Thread(target=self.emit("sendMessage", {"username": Info['autoconnect'][Message['chatroomId']], "chatroomId": Message['chatroomId'], "text": Running_Modules.input.input(Message, self)}))
				t.run()
		except Exception as inf:
			print("[tokaNamespace.on_receiveMessage] "+str(inf))

print('--------------LOADED--------------')
##### ///// #####