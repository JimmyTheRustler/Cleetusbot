const Commando = require('discord.js-commando');

module.exports = class sarcasm extends Commando.Command{
    constructor (client){
        super(client,{
            name: 'sarcasm',
            group: 'memes',
            memberName: 'sarcasm',
            description: 'SpOnGeBoB sArCaSm',
            examples:['./sarcasm Uh oh, stinky'],
            args:[
                {
                    key: 'words',
                    prompt: "Enter text to sarcasm-fy",
                    type: 'string'
                }
            ]
        });
      }


    async run(message, args){
      var input = args.words;
      var output = '';
      var upperSwitch = 0;
      input = input.toLowerCase();
      var i;

      for(i = 0; i < input.length; i++){
        if( input.charAt(i).match(' ') ){
          output += input.charAt(i);
        }
        if( input.charAt(i).match(/[a-z]/i) && upperSwitch === 1 ){
          output += input.charAt(i).toUpperCase();
          upperSwitch = 0;
        }
        else if( input.charAt(i).match(/[a-z]/i) && upperSwitch === 0 ){
          output += input.charAt(i);
          upperSwitch = 1;
        }
      }
      message.delete();
      message.channel.send(output);
    }
   }
