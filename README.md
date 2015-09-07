I have decided to use NodeJS for my bot from this point, mostl likely can and will change more :P

It currently only works for Twitch.tv but it can be changed around, expect more updates to happen as Twitch implements their new IRCv3 infrastructure that I have gone over briefly in the index.js.

I made the base of this over a 3 day weekend, so don't expect it to be perfect, however it is limited to 15 chats and commands a second to keep you from getting banned in any chat. I wanted to store all my bobbot/waifu__bot info into my MongoDB so I made that the default push/pull server. Otherwise most of the actual code is in the channel object and the bobbot function is primary logic and interaction between the IRC server and the bot.