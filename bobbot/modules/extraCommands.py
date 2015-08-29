##### EXTRA COMMANDS #####

print('----------------------------------')
print('------Loading: extraCommands------')
print('----------------------------------')

import sys
import urllib.request
import imp

config = imp.new_module('config')
exec(urllib.request.urlopen('https://raw.githubusercontent.com/Bob620/Bob_Bot/master/bobbot/modules/config.py').read().decode('utf8'), config.__dict__)
Running_Modules = config.Running_Modules

class extraCommands():

	def palin(Channel, Text):
		try:
			if len(Text) == 0:
				return "!palin TEXT TO FLIP"
			else:
				Text = ' '.join(Text)
				TextFlip = Text[::-1]
				if Text == TextFlip:
					return "The text: "+Text+"\n is a palindrome!"
				else:
					return "The text: "+Text+"\n is not a palindrome!"
		except Exception as inf:
			print("[extraCommands.palin] "+str(inf))

	def exit(Channel, Text):
		try:
			sys.exit("Program closed by Operator!")
		except Exception as inf:
			print("[extraCommands.exit] "+str(inf))




print('--------------LOADED--------------')
##### ///// #####