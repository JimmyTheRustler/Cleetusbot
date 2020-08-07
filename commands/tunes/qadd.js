const Commando = require('discord.js-commando');
const ytdl = require('ytdl-core');
const db = require('quick.db');

module.exports = class qadd extends Commando.Command{
    constructor (client){
        super(client,{
            name: 'qadd',
            group: 'tunes',
            memberName: 'qadd',
            description: 'Creates/modifies current song queue',
            examples:['./qadd https://www.youtube.com/watch?v=aiEJgyGUwIk'],
            args:[
                {
                    key: 'link',
                    prompt: "Enter a youtube link",
                    type: 'string',
                    default: 'all'
                }
            ]
        });
    }
    async run(message, args){
        // db.push('queue', args.link);
        // var msg = '```' + db.get('queue') + '```';
        // message.channel.send(msg);
        
        var ytTitle = '';
        ytdl.getBasicInfo(args.link, function(err, info) {
            ytTitle = info.title;
        });
        
        if(db.has('queue') === false){
            var queue = new db.table('queue');
            message.channel.send('New queue created');
        }
       
        queue.push('url', args.link);
        queue.push('title', ytTitle);
        
        //var msg = '```' + queue.get('url') + '```';
        var msg = '```' + queue.get('title') + '```';
        console.log('Title: ' + ytTitle);
    }
}
