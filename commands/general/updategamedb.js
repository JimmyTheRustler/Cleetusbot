const Commando = require('discord.js-commando');
const MySQL = require('mysql');
const fetch = require("node-fetch");

let cli;

module.exports = class updategamedb extends Commando.Command{
    constructor (client){
        super(client,{
            name: 'updategamedb',
            group: 'general',
            memberName: 'updategamedb',
            description: 'Only used to update steamGames table. Run command when new games come out.',
            examples:['./updategamedb']
        });
        cli = client;
    }
    async run(message){
        //console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        let strt = new Date();
        message.channel.send('Fetching steam catalog...');
        let url = "http://api.steampowered.com/ISteamApps/GetAppList/v2";
        let steamObj = await fetchSteamJson(url);
        let end = new Date();
        let elapsed = end - strt;
        message.channel.send('Fetching complete, took ' + elapsed/1000 + ' seconds');
        
        sqlClearDB();
        message.channel.send('Database cleared');

        for(let i = 0; i < steamObj.applist.apps.length; i++){
            sqlPushSteamGames(steamObj.applist.apps[i].appid, steamObj.applist.apps[i].name);
        }
        message.channel.send('Database Updated!');
        
    }
}

async function fetchSteamJson(url){
    let response = await fetch(url);
    let data = await response.json();
    return data;
}

async function sqlPushSteamGames(appId, name){
    let tmp;
    let sql='INSERT INTO steamGames (appId, name) VALUES ('+appId+', \''+name+'\');';
    tmp = new Promise((res, rej) => {
        global.pool.query(sql, function (err, results, fields) {    
            if(err){
                console.log(err);
            }
            //res(results[0].steamId);
        });
    });
    return await tmp;
}
async function sqlClearDB(){
    let tmp;
    let sql='DELETE FROM steamGames;';
    tmp = new Promise((res, rej) => {
        global.pool.query(sql, function (err, results, fields) {    
            if(err){
                console.log(err);
            }
            //res(results[0].steamId);
        });
    });
    return await tmp;
}