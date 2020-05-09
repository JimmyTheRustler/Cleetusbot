const Commando = require('discord.js-commando');
const fetch = require('node-fetch');
const client = require('nekos.life');
const neko = new client();

module.exports = class owo extends Commando.Command{
    constructor (client){
        super(client,{
            name: 'owo',
            group: 'memes',
            memberName: 'owo',
            description: 'OwO-ify text.',
            examples:['./owo notices bulge OwO whats this?'],
            args:[
              {
                  key: 'text',
                  prompt: "Enter text",
                  type: 'string',
                  default: 'all'
              }
          ]

        });

    }
    async run(message,args){
      var input = args.text;
      let owo = await neko.sfw.OwOify({text: input});
      message.channel.send(owo.owo);
    }
}
