##### TOKA #####

from socketIO_client import SocketIO, BaseNamespace

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