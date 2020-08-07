const Commando = require('discord.js-commando');
const db = require('quick.db');

module.exports = class qclear extends Commando.Command{
    constructor (client){
        super(client,{
            name: 'qclear',
            group: 'tunes',
            memberName: 'qclear',
            description: 'Clears current song queue',
            examples:['./qclear']
        });
    }
    async run(message){
        db.delete('queue');
        var msg = '```' + db.get('queue') + '```';
        if(db.has('queue') === false)
            message.channel.send('Queue cleared');
    }
}
