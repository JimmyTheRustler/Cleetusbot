/* eslint-disable no-undef */
const Commando = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const snoowrap = require('snoowrap');
const config = require('../../config.json');

module.exports = class simp extends Commando.Command{
  constructor (client){
      super(client,{
          name: 'simp',
          group: 'memes',
          memberName: 'simp',
          description: 'Returns a random simping comment',
          examples:['./simp']
      });
  }
  async run(message){
    let subreddits = ['RealGirls','gonewild','nsfw','collegesluts','bustypetite','LegalTeens','breedingmaterial','cuckold','milf'
                      ,'tiktoknsfw','GirlsFinishingTheJob','holdthemoan','biggerthanyouthought','hentai',];
    
    let sub = getRandomInt(subreddits.length);

    const reddit = new snoowrap({
      userAgent: 'CleetusBot',
      clientId: config.redditId,
      clientSecret: config.redditKey,
      refreshToken: config.redditRefreshToken
    });
    let b = await reddit.getSubreddit(subreddits[sub]).getNewComments();
    let randomPostNum = getRandomInt(b.length);
    while(b[randomPostNum].body.length > 240){
      b = await reddit.getSubreddit(subreddits[sub]).getNewComments();
    }
    //console.log(b.length);

    const ootput = new RichEmbed()
      .setTitle(b[randomPostNum].body)
      .setDescription(b[randomPostNum].subreddit_name_prefixed)
      .setURL(b[randomPostNum].link_permalink);

    //message.channel.send(output);
    message.channel.send(ootput);


  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}