##### TOKANAMESPACE #####

print('----------------------------------')
print('------Loading: tokaNamespace------')
print('----------------------------------')

from socketIO_client import SocketIO, BaseNamespace
import imp
import urllib.request

config = imp.new_module('config')
exec(urllib.request.urlopen('https://raw.githubusercontent.com/Bob620/Bob_Bot/master/bobbot/modules/config.py').read().decode('utf8'), config.__dict__)
Running_Modules = config.Running_Modules

class tokaNamespace(BaseNamespace):

	BobBot = ''
	CurrentMoodType = ''
	
	def on_connect(self):
		print('[Connected]')
		Info = Running_Modules.fileInteraction.readfile('info', 'json')
		for Channel in Info['autoconnect']:
			Running_Modules.toka.Connect(Channel, Info['name'], self)
	
	def on_disconnect(self):
		print('[Disconnected]')
		Info = Running_Modules.fileInteraction.readfile('info', 'json')
		for Channel in Info['autoconnect']:
			Running_Modules.toka.Disconnect(Channel, Info['name'], self)
	
	def on_history(self, History):
		print('[History]')
	
	def on_viewers(self, Viewers):
		print('[Viewers]')
	
	def on_receiveMessage(self, Message):
		if Message['data']['username'].lower() != 'waifubot':
			Info = Running_Modules.fileInteraction.readfile('info', 'json')
			self.emit("sendMessage", {"username": Info['name'], "chatroomID": Message['chatroomID'], "text": Running_Modules.input.input(Message, self)})

print('--------------LOADED--------------')
##### ///// #####