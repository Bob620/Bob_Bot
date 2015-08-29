##### TOKA #####

print('----------------------------------')
print('----------Loading: toka-----------')
print('----------------------------------')

from socketIO_client import SocketIO, BaseNamespace
import imp
import urllib.request

config = imp.new_module('config')
exec(urllib.request.urlopen('https://raw.githubusercontent.com/Bob620/Bob_Bot/master/bobbot/modules/config.py').read().decode('utf8'), config.__dict__)
Running_Modules = config.Running_Modules

class toka():

	def Connect(Channel, Username, Chat):
		try:
			Chat.emit('join', {'username': Username, 'chatroomId': Channel})
			print('Joined Channel '+Channel)
		except Exception as inf:
			print("[toka.Connect] "+str(inf))
			pass

	def Disconnect(Channel, Username, Chat):
		try:
			Chat.emit('join', {'username': Username, 'chatroomId': Channel})
			print('Joined Channel '+Channel)
		except Exception as inf:
			print("[toka.Disconnect] "+str(inf))
			return Connect(Channels, Username, Chat)

print('--------------LOADED--------------')
##### ///// #####