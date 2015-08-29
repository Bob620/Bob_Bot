##### Speech Recognition #####
# This module will allow access to Bobbot via voice commands picked up through the computer's mic

print('----------------------------------')
print('-----Loading: fileInteraction-----')
print('----------------------------------')

import speech_recognition as sr
import imp
import urllib.request

config = imp.new_module('config')
exec(urllib.request.urlopen('https://raw.githubusercontent.com/Bob620/Bob_Bot/master/bobbot/modules/config.py').read().decode('utf8'), config.__dict__)
Running_Modules = config.Running_Modules

Recognizer = sr.Recognizer()
with sr.Microphone() as source:
    audio = Recognizer.listen(source)

try:
    print("You said " + r.recognize(audio))
except LookupError:
    print("Could not understand audio")

print('--------------LOADED--------------')
##### ///// #####