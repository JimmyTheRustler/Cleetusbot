const Commando = require('discord.js-commando');
const client = require('nekos.life');
const neko = new client();

module.exports = class nekogif extends Commando.Command{
    constructor (client){
        super(client,{
            name: 'nekogif',
            group: 'nsfw',
            memberName: 'nekogif',
            description: 'Returns random Hentai gif',
            examples:['./nekogif']
        });
    }

    async run(message){
      neko.nsfw.randomHentaiGif().then(neko => {message.channel.send(neko.url);});
    }
}
