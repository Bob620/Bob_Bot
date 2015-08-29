##### TEXT PARSER #####

print('----------------------------------')
print('-------Loading: textParser--------')
print('----------------------------------')

import imp
import urllib.request
import re

config = imp.new_module('config')
exec(urllib.request.urlopen('https://raw.githubusercontent.com/Bob620/Bob_Bot/master/bobbot/modules/config.py').read().decode('utf8'), config.__dict__)
Running_Modules = config.Running_Modules

class textParser():

	def textparse(User, Channel, Text, self):
		try:
			Info = Running_Modules.fileInteraction.readfile('info', 'json')
			OwnName = Info['autoconnect'][Channel]
			# Basic Commands
			if Text.startswith('!'):
				TextParse = Text.split()
				if len(TextParse) >= 2:
					return Running_Modules.input.command(TextParse.pop(0).strip('!').lower(), TextParse, User, Channel)
				else:
					return Running_Modules.input.command(TextParse.pop(0).strip('!').lower(), '', User, Channel)
			else:
				# This is where it actually starts... :P
				Words_ = Running_Modules.fileInteraction.readfile('words', 'json')
				SentenceJson = {}
				Pos = -1
				# Split on punctuation
				if Text.endswith('.') == False:
					Text = Text+'.'
				TextParse = re.split('[\.\!\?]+', Text)
				# Search and Destroy time!
				for Sentence in TextParse:
					Pos = Pos+1
					WordPos = -1
					SentenceJson[Pos] = {}
					Sentence = Sentence.split()
					# Preset each word's info
					for Word in Sentence:
						WordPos = WordPos+1
						SentenceJson[Pos][WordPos] = {}
						SentenceJson[Pos][WordPos]['word'] = Word
						SentenceJson[Pos][WordPos]['amount'] = 'single'
					
					WordPos = -1
					# Run parser on each word
					for Word in Sentence:
						WordPos = WordPos+1
						
						####
						# Pre-Processor
						#   Mostly Exceptions :P
						####
						
						if Word == OwnName.lower():
							SentenceJson[Pos][WordPos]['ps'] = 'noun/me'
						
						if Word == '>':
							if WordPos == len(Sentence):
								try:
									if SentenceJson[Pos+1][0]['word'] == '>':
										SentenceJson[Pos][WordPos]['ps'] = 'emote'
									else:
										if SentenceJson[Pos+1][0]['word'] == '<':
											SentenceJson[Pos][WordPos]['ps'] = 'emote'
								except:
									useless = ''
							else:
								try:
									if WordPos == 0:
										if SentenceJson[Pos-1][len(Sentence)]['word'] == '>':
											SentenceJson[Pos][WordPos]['ps'] = 'emote'
										else:
											if SentenceJson[Pos-1][len(Sentence)]['word'] == '<':
												SentenceJson[Pos][WordPos]['ps'] = 'emote'
								except:
									useless = ''
						
						####
						# Primary Word Testing
						#   Includes Exceptions
						####
						
						# Emote Testing
						for Words in Words_['emotes']:
							if Word.lower() == Words:
								SentenceJson[Pos][WordPos]['ps'] = 'emote/'
						
						# Conjuction Testing
						for Words in Words_['conjunction']:
							if Word.lower() == Words:
								SentenceJson[Pos][WordPos]['ps'] = 'conjunction'
						
						# Known Noun Testing
						for Types in Words_['noun']:
							for Words in Words_['noun'][Types]:
								if Word.lower() == Words:
									SentenceJson[Pos][WordPos]['ps'] = 'noun/'+Types
						
						# Known Verb Testing
						for Types in Words_['verb']:
							for Words in Words_['verb'][Types]:
								if Word.lower() == Words:
									SentenceJson[Pos][WordPos]['ps'] = 'verb/'+Types
						
						# Known Possessive Testing
						for Types in Words_['possessive']:
							for Words in Words_['possessive'][Types]:
								if Word.lower() == Words:
									SentenceJson[Pos][WordPos]['ps'] = 'possessive/'+Types
						
						# Known Plural Testing
						for Words in Words_['plural']:
							if Word.lower() == Words:
								SentenceJson[Pos][WordPos]['amount'] = 'plural'

						# Known Question Testing
						for Words in Words_['question']:
							if Word.lower() == Words:
								SentenceJson[Pos][WordPos]['ps'] = 'question/'
						
						#####
						# Secondary Word Tester and Finder
						#   Basic Word Finding
						#####
						
						# Plural Parser
						if Word.lower().endswith('s'):
							if len(Word) > 4:
								if Word.lower().endswith('ss') == False:
									SentenceJson[Pos][WordPos]['amount'] == 'plural'
								else:
									if SentenceJson[Pos][WordPos]['amount'] != 'plural':
										SentenceJson[Pos][WordPos]['amount'] == 'single'
							else:
								if SentenceJson[Pos][WordPos]['amount'] != 'plural':
									SentenceJson[Pos][WordPos]['amount'] == 'single'
						else:
							if SentenceJson[Pos][WordPos]['amount'] != 'plural':
								SentenceJson[Pos][WordPos]['amount'] == 'single'
						
						# Verb Parser
						if Word.lower().endswith('ed'):
							if len(Word) > 4:
								SentenceJson[Pos][WordPos]['ps'] = 'verb/'
								SentenceJson[Pos][WordPos]['tense'] = 'past'
						
						if Word.lower().endswith('ing'):
							if len(Word) > 6:
								SentenceJson[Pos][WordPos]['ps'] = 'verb/'
								SentenceJson[Pos][WordPos]['tense'] = 'future'

						# Possessive Parser
						if Word.lower().endswith('\'s'):
							if len(Word) > 4:
								SentenceJson[Pos][WordPos]['ps'] = 'noun/possessive/self'
						
					# Sentence Rephraser and Final Delimiter
					#Final = {"ps":"", "tense":{"future":0,"past":0,"present":0}}
					#for Sentence in SentenceJson:
					#	for Word in SentenceJson[Sentence]:
					#		try:
					#			for Type in SentenceJson[Sentence][Word]['ps'].split('/'):
					#				if Type == "question":
					#					Final["ps"] = "question"
					#		except:
					#			pass
					#		Final["tense"][Word['tense']] = Final["tense"][Word['tense']]+1

					return ''



		except Exception as inf:
			print("[textParser.textparse] "+str(inf))


print('--------------LOADED--------------')
##### ///// #####