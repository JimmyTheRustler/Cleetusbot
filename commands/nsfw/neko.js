const Commando = require('discord.js-commando');
const client = require('nekos.life');
const nekko = new client();

module.exports = class neko extends Commando.Command{
    constructor (client){
        super(client,{
            name: 'neko',
            group: 'nsfw',
            memberName: 'neko',
            description: 'Returns random Neko pic',
            examples:['./neko']
        });
    }

    async run(message){
      nekko.nsfw.neko().then(nekko => {message.channel.send(nekko.url);});
    }
}
