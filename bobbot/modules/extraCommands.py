##### EXTRA COMMANDS #####

print('----------------------------------')
print('------Loading: extraCommands------')
print('----------------------------------')

config = imp.new_module('config')
exec(urllib.request.urlopen('https://raw.githubusercontent.com/Bob620/Bob_Bot/master/bobbot/modules/config.py').read().decode('utf8'), config.__dict__)
Running_Modules = config.Running_Modules

class extraCommands():

	def palin(Channel, Text):
		TextFlip = Text[::-1]
		if Text == TextFlip:
			return "The text: "+Text+"\n is a palindrome!"
		else:
			return "The text: "+Text+"\n is not a palindrome!"

print('--------------LOADED--------------')
##### ///// #####