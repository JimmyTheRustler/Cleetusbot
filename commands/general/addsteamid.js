const Commando = require('discord.js-commando');
const MySQL = require('mysql');
let cli;

module.exports = class addsteamid extends Commando.Command{
    constructor (client){
        super(client,{
            name: 'addsteamid',
            group: 'general',
            memberName: 'addsteamid',
            description: 'Used to populate discordID to steamID table',
            examples:['./addsteamid @discordName steamID64'],
            args: [
                {
                    key: 'discordID',
                    prompt: 'Enter discord user',
                    type: 'user' 
                },
                {
                    key: 'steamID64',
                    prompt: 'Enter steamID64',
                    type: 'string' 
                }
            ]
        });
        cli = client;
    }
    async run(message, args){

        global.pool.query("SELECT discordId FROM cleetusbot.steamIds WHERE discordId = \"" + args.discordID.id + "\";", function (err, result) {
            if(err){
                console.log('add Query for getting discordId\n', err);
            }else if(result.length === 1){
                message.reply(args.discordID + ' is already in the database.');
            }else{
                var sql = "INSERT INTO cleetusbot.steamIds (discordId, steamId) VALUES (\"" + args.discordID.id + "\",\"" + args.steamID64 + "\");";
                global.pool.query(sql, function(err){
                    if(err){
                        console.log('add Query for inserting steamID64\n', err);
                    }else{
                        message.channel.send(args.discordID + ' has been added to steamIds database');
                    }
                });
            }
        });
        
    }
}
