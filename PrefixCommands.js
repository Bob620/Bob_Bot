module.exports = class {
    constructor() {
    }
    static parse(server, message, symbol) {
        if (symbol === '!' || symbol === '$' || symbol === '~' || symbol === '?' || symbol === '>' || symbol === '`') {
            server.prefix = symbol;
            message.channel.sendMessage("WARNING: PREFIX HAS CHANGED TO: "+symbol+"\nUSE '"+symbol+"help' IF YOU NEED MORE INFORMATION")
            .then(() => {

            })
            .catch(() => {

            });
        } else {
            this.basicHelp(server, message);
        }
    }
    static basicHelp(server, message) {
        message.channel.sendMessage("!, $, ~, ?, >, or ` are the allowed prefixes, Default is !")
        .then(() => {

        })
        .catch(() => {

        });
    }
}