##### TOKA #####

from socketIO_client import SocketIO, BaseNamespace

config = imp.new_module('config')
exec(urllib.request.urlopen('https://raw.githubusercontent.com/Bob620/Bob_Bot/master/bobbot/modules/config.py').read().decode('utf8'), config.__dict__)
Running_Modules = config.Running_Modules

class toka():

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

##### ///// #####