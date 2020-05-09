const Commando = require('discord.js-commando');
var cli;

module.exports = class bot extends Commando.Command{
    constructor (client){
        super(client,{
            name: 'bot',
            group: 'general',
            memberName: 'bot',
            description: 'Displays the totlal up time of the bot.',
            examples:['./bot']
        });
        cli = client;
    }
    async run(message){
        var days = Math.floor(cli.uptime / 1000 / 60 / 60 / 24);
        var hours = Math.floor((cli.uptime / 1000 / 60 / 60) % 24);
        var minutes = Math.floor((cli.uptime / 1000 / 60) % 60);
        var dayText = "day";
        var hourText = "hour";
        var minText = "minute";
        if(days !== 1){
            dayText += "s";
        }
        if(hours !== 1){
            hourText += "s";
        }
        if(minutes !== 1){
            minText += "s";
        }
        message.channel.send("I have been online for " + days + " " + dayText + ", " + hours + " " + hourText + ", and " + minutes + " " + minText + ".");

    }
}
