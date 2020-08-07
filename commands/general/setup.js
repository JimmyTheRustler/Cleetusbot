const Commando = require('discord.js-commando');
const mkdirp = require('mkdirp');

module.exports = class bot extends Commando.Command{
    constructor (client){
        super(client,{
            name: 'setup',
            group: 'general',
            memberName: 'setup',
            description: 'Creates directories for discord server',
            examples:['./setup']
        });
    }
    async run(message){

        var dirName = '/home/pi/CleetusBotData/' + message.guild.id;

        mkdirp(dirName, function (err) {
            if (err) console.error(err)
            else console.log('Created!')
        });

        dirName = dirName + '/music';

        mkdirp(dirName, function (err) {
            if (err) console.error(err)
            else console.log('Created!')
        });

        message.channel.send('Setup completed!');
    }
}
