from socketIO_client import SocketIO, BaseNamespace
import threading
import time

class Namespace(BaseNamespace):
    
    AThread = ''
    
    def on_connect(self):
        print('[Connected]')
    
    def on_disconnect(self):
        print('[Disconnected]')
    
    def on_history(self, History):
        print('History')
    
    def on_viewers(self, Viewers):
        print('Viewers')
    
    def on_message(self, Message):
        try:
            Useless = Message.decode('utf8')
        except:
            try:
                if str(Message['type']) == 'message':
                    Name = str(Message['data']['username']).lower()
                    Channel = str(Message['chatroomID'])
                    Text = str(Message['data']['text'])
                    print(Channel+':'+Name+': '+Text)
                    
                    if Text.lower().startswith('!'):
                        TextSplit = Text.split()
                        if TextSplit[0].lower() == '!lewd':
                            Output = 'Rub it all over me Kappa'
                            if self.BobBot.output(self, Channel, Output):
                                pass
                            else:
                                return print('Message Failed to Send!')
                            if TextSplit[0].lower() == '!spam':
                                if TextSplit[1].lower() == 'start':
                                    Threads = threading.active_count()
                                    self.BobBot.output(self, Channel, 'Starting Spamming with Thread '+str(Threads))
                                    time.sleep(1)
                                    self.AThread = threading.Thread(target=self.BobBot.spam, args=(self, str(Channel)), daemon=True)
                                    self.AThread.start()
                                    return True
                                if TextSplit[1].lower() == 'stop':
                                    if AThread.stop():
                                        return self.BobBot.output(self, Channel, 'Threads Closed!')
			except Exception as inf:
				print(str(inf))
				return print('Failure on Spam Command!')
	
    class BobBot():
    	
        def output(self, Channel, Text):
            try:
                self.emit('message', {'username': Username, 'chatroomID': Channel, 'text': Text})
                print(Channel+':'+Username+': '+Text)
                return True
            except:
                return False
		
        def spam(self, Channel):
            try:
                def stop():
                    return threading.ThreadError(True)
				
                while 1:
                    time.sleep(0.01)
                    self.emit('message', {'username': Username, 'chatroomID': Channel, 'text': 'NOTICE ME SENPAI'})
            except:
                return self.BobBot.output(self, Channel, 'Error Occured While Spamming!')

Username = 'WaifuBot'
Channels = ['1']
Chata = SocketIO('toka.io', 1337, Namespace)
for Channel in Channels:
    Chata.emit('join', {'username': Username, 'chatroomID': Channel})
    print('Joined Channel '+Channel)
Chata.wait()
