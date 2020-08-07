const Commando = require('discord.js-commando');
const config = require('../../config.json');
const _ = require('underscore');
const fetch = require("node-fetch");
const MySQL = require('mysql');

module.exports = class whattoplay extends Commando.Command{
    constructor (client){
        super(client,{
            name: 'whattoplay',
            aliases: ['wtp'],
            group: 'general',
            memberName: 'whattoplay',
            description: 'Finds games that everyone owns',
            examples:['./whattoplay @steamuser1 @steamuser2 @steamuser3'],
            args: [
                {
                    key: 'users',
                    prompt: 'Enter a discord user to find steam games of',
                    type: 'string',
                    default: ''
                }
            ]
        });
    }
    async run(message, args){
        let users = [];
        let username = [];
        let usersDirty = args.users.split(' ');
        let subUsers = usersDirty.map((user) => user.substring(3,user.length - 1));
        let userObjs = subUsers.map((subUser) => this.client.users.get(subUser));

       for(let i = 0; i < userObjs.length; i++){
            if(userObjs[i] !== undefined){
                users.push(userObjs[i].id);
                username.push(userObjs[i].username);
            }
        }

        let steamIds = [];
        for(let i = 0; i < users.length; i++){
            steamIds.push(await sqlGetSteamId(users[i]));
        }

        let gameList = [];
        let tmpGameList = [];
        

        for(let i = 0; i < steamIds.length; i++){
            let url = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=" + config.steamKey + "&steamid=" + steamIds[i] + "&format=json";
            let steamObj = await fetchSteamJson(url);

            if(_.isEmpty(steamObj.response)){
                message.channel.send('Uh Oh! Looks like ' + username[i] + ' is a big pussy and has their account set to private! Skipping their games...');
            }
            else{
                
                
                if(!Array.isArray(gameList) || !gameList.length){
                    for(let i = 0; i < steamObj.response.game_count; i++){
                        gameList.push(steamObj.response.games[i].appid)
                    }
                }
                else{
                    for(let i = 0; i < steamObj.response.game_count; i++){
                        tmpGameList.push(steamObj.response.games[i].appid)
                    }
                    gameList = _.intersection(gameList, tmpGameList);
                }

            }

        }     
        sqlClearDB();

        if(gameList.length === 0){
            message.channel.send('No games found');
        }
        else{
            for(let i = 0; i < gameList.length; i++){
                sqlPushSteamappid(gameList[i]);
            }
            let steamNameObj = await sqlGetSteamNames();
            
            let output='```';
            for(let i = 0; i < steamNameObj.length; i++){
                output = output.concat(steamNameObj[i].name + '\n');
                if(output.length > 1800){
                    output = output.concat('```');
                    message.channel.send(output);
                    output = '```';
                }
            }
            output = output.concat('```');
            message.channel.send(output);
        }
        
        
    }    
}

async function sqlGetSteamNames(){
    let tmp;
    let sql='SELECT * FROM cleetusbot.steamGames INNER JOIN tmp ON cleetusbot.steamGames.appId = cleetusbot.tmp.appId;';
    tmp = new Promise((res, rej) => {
        global.pool.query(sql,function (err, results, fields) {    
            if(err){
                console.log(err);
            }
            
            res(results);
        });
    });
    return await tmp;
}

async function sqlGetSteamId(discordid){
    let tmp;
    let sql='SELECT steamId FROM cleetusbot.steamIds WHERE discordId='+discordid;
    tmp = new Promise((res, rej) => {
        global.pool.query(sql, [discordid],function (err, results, fields) {    
            if(err){
                console.log(err);
            }
            res(results[0].steamId);
        });
    });
    return await tmp;
}

async function sqlPushSteamappid(appId){
    let tmp;
    let sql='INSERT INTO cleetusbot.tmp (appId) VALUES ('+appId+');';
    tmp = new Promise((res, rej) => {
        global.pool.query(sql, [appId], function (err, results, fields) {    
            if(err){
                console.log(err);
            }
        });
    });
    return await tmp;
}

async function fetchSteamJson(url){
    let response = await fetch(url);
    let data = await response.json();
    return data;
}

async function sqlClearDB(){
    let tmp;
    let sql='DELETE FROM cleetusbot.tmp;';
    tmp = new Promise((res, rej) => {
        global.pool.query(sql, function (err, results, fields) {    
            if(err){
                console.log(err);
            }
        });
    });
    return await tmp;
}