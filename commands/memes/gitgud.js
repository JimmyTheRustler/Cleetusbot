const Commando = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const oneLine = require('common-tags').oneLine;

module.exports = class gitgud extends Commando.Command{
    constructor(client) {
        super(client, {
            name: 'gitgud',
            group: 'memes',
            memberName: 'gitgud',
            description: 'Gitgud u small weiner',
            examples: ["./gitgud"],
            args: [
                {
                    key: 'gitgud',
                    prompt: 'gitgud',
                    type: 'string',
                    default: 'all'
                }
            ]
        });
    }

    async run(message){
      var imgArray = ['src/gitgud/0.jpg', 'src/gitgud/1.gif', 'src/gitgud/2.png', 'src/gitgud/3.jpg', 'src/gitgud/4.jpg', 'src/gitgud/5.jpg', 'src/gitgud/6.png', 'src/gitgud/7.jpg', 'src/gitgud/8.jpg', 'src/gitgud/9.png', 'src/gitgud/10.png'];
      var randNum = Math.round(Math.random() * 10);
      message.channel.send( {files: [imgArray[randNum]]} );

    }
  }
