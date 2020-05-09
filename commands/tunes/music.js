const Commando = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const ytdl = require('ytdl-core');
//a map of all the songs in the queue
const queue = new Map();


module.exports = class music extends Commando.Command{
    constructor(client) {
        super(client, {
            name: 'music',
            group: 'tunes',
            memberName: 'music',
            description: 'When you wanna groove',
            examples: ["./music \"Music command\" \"youtube link to song\""],
            args: [
                {
                    key: 'interaction',
                    prompt: '\"play, pause, resume, skip, stop, leave\"',
                    type: 'string',
                    default: 'play'
                },
                {
                  key: 'option',
                  prompt: 'sets a music option',
                  type: 'string',
                  //default: 'https://www.youtube.com/watch?v=L1syyYgsV-s',
                  validate: option => {
                      if (option.length < 101) return true;
                      return 'Cannot give an option of over 100 characters.';
                  }
                }
            ]
        });
    }

    async run(message, { interaction, option }){

      const serverQueue = queue.get(message.guild.id);

      //all music interactions
      if(interaction == 'play'){
        execute(option, serverQueue);
        return;
      }
      else if(interaction == 'stop'){
        message.channel.send("Not implented yet");
      }
      else if(interaction == 'pause'){
        pause(serverQueue);
        return;
      }
      else if(interaction == 'resume'){
        resume(serverQueue);
        return;
      }
      else if(interaction == 'skip'){
        skip(option,serverQueue);
        return;
      }
      else if(interaction == 'leave'){
        leave(serverQueue);
        return;
      }
      else{
        message.channel.send("Stop speaking gibberish, redo command");
        return;
      }


      async function execute(option, serverQueue){
        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel){
          return message.channel.send('You need to be in a voice channel to play music you dork');
        }
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
          return message.channel.send('I dOnT hAvE pErMiSsIoNs');
        }
        //takes the youtube link and calls ytdl with it. fills song obj.
        const songInfo = await ytdl.getInfo(option);
        const song = {
          title: songInfo.title,
          url: songInfo.video_url,
        };

        /*
        First we check if the queue is empty, if yes we push
        a song to it. If the queue has some contents then we make
        a contract and add the song to the songs array. Then the bot
        will attempt to connect to the voice channel of the user
        and call the play function to start the song.
        */
        if(!serverQueue){
          const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true,
          };

          queue.set(message.guild.id, queueContruct);
          queueContruct.songs.push(song);

          try {
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            play(message.guild, queueContruct.songs[0]);
          }
          catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
          }
        }
        else{
          serverQueue.songs.push(song);
          return message.channel.send('${song.title} has been chucked in queue');
        }
    }


    function play(guild, song) {
      const serverQueue = queue.get(guild.id);
      //if songs is empty we leave the voice channel and delete queue
      if(!song){
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
      }
      /*
      Create a stream with the youtube URL.
      also have 2 listeners to tell when track ends or
      if there was an error
      */
      const dispatcher =serverQueue.connection.playStream(ytdl(song.url))
        .on('end',() =>{
          serverQueue.songs.shift();
          play(guild,serverQueue.song[0])
        }).on('error', error => {
          console.error(err);
        });
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    }


    function skip(option, serverQueue){
      if(!option.memeber.voiceChannel){
        return message.channel.send('You have to be in a voice channel to skip song.');
      }
      if(!serverQueue){
        return message.channel.send('No song to skip.');
      }
      serverQueue.connection.dispatcher.end();
    }




    function pause(serverQueue){
      if (!message.member.voiceChannel){
        return message.channel.send('You have to be in a voice channel to pause the music!');
      }
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
    }


    function resume(serverQueue){
      return;
    }




    function stop(serverQueue){
      if (!message.member.voiceChannel){
        return message.channel.send('You have to be in a voice channel to stop the music');
      }
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
    }




    function leave(serverQueue){
      if (!message.member.voiceChannel){
        return message.channel.send('You have to be in a voice channel to make Cleetus leave');
      }
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
        voiceChannel.leave();
    }
  }
}
