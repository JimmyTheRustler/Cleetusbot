const Commando = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const fetch = require("node-fetch");

module.exports = class bot extends Commando.Command{
    constructor (client){
        super(client,{
            name: 'reddit',
            group: 'memes',
            memberName: 'memes',
            description: 'Pulls a random picture from a user defined subreddit',
            examples:['./reddit dankchristianmemes'],
            args:[
              {
                  key: 'query',
                  prompt: "Enter a subreddit",
                  type: 'string',
                  default: 'all'
              }
          ]
        });
    }
    async run(message, args){
      function loadPic() {
        fetch('https://www.reddit.com/r/'+args.query+'.json?limit=100&?sort=top&t=month')
          .then(res => res.json())
          //.then(json => json.data.children.map(v => v.data.url))
          .then(json => postRandomPic(json));
      }
      function postRandomPic(json){
        if(json.data.children.length === 0){
            message.channel.send("Sorry, either the subreddit provided does not exist or no data is available at this time.");
        }
        else{
          const random_url = json.data.children[Math.floor(Math.random() * json.data.children.length) + 1].data.url;
          message.channel.send(random_url);
        }
      }
      loadPic();
    }
  }
