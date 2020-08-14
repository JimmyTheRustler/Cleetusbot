/* eslint-disable no-undef */
const Commando = require('discord.js-commando');
const config = require('../../config.json');
const _ = require('underscore');
const fetch = require('node-fetch');

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
        let usrPromises = [];
        let steamIds = [];
        usrPromises = users.map(id => sqlGetSteamId(id));
        steamIds = await Promise.all(usrPromises);

        
        let steamObjArr = [];
        usrPromises = [];        
        
        usrPromises = steamIds.map(id => fetch(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${config.steamKey}&steamid=${id}&format=json`).then(res => res.json()));
        steamObjArr = await Promise.all(usrPromises);

        let gameList = [];
        let tmpGameList = [];
        for(let i = 0; i < steamObjArr.length; i++){
            if(_.isEmpty(steamObjArr[i].response)){
                message.channel.send(`Uh Oh! Looks like ${username[i]} is a big pussy and has their account set to private! Skipping their games...`);
            }
            else{
                if(!Array.isArray(gameList) || !gameList.length){
                    for(let j = 0; j < steamObjArr[i].response.game_count; j++){
                        gameList.push(steamObjArr[i].response.games[j].appid);
                    }
                }
                else{
                    for(let h = 0; h < steamObjArr[i].response.game_count; h++){
                        tmpGameList.push(steamObjArr[i].response.games[h].appid);
                    }
                    gameList = _.intersection(gameList, tmpGameList);
                    tmpGameList = [];
                }
            }
        }     
        let sqlWhereQuery = '';
        for(let i = 0; i < gameList.length; i++){
            sqlWhereQuery = sqlWhereQuery.concat(`appId=${gameList[i]}`);
            if(i !== gameList.length-1){
                sqlWhereQuery = sqlWhereQuery.concat(' OR ');
            }
        }

        let steamNameObj;
        if(gameList.length === 0){
            message.channel.send('No games found');
        }
        else{
            usrPromises = [];
            steamNameObj = await sqlGetSteamNames(sqlWhereQuery);
        }


        let steamNameArr = [];
        for(let i = 0; i < steamNameObj.length; i++){
            steamNameArr.push(steamNameObj[i].name);
        }
        const uniqueSteamNames = new Set(steamNameArr);
        steamNameArr = [...uniqueSteamNames];

        let output='```';
        if(steamNameArr.length === 0){
            output = output.concat('Error retrieving game name list...');
        }
        else{
            for(let i = 0; i < steamNameArr.length; i++){
                output = output.concat(i+1 + '. ' + steamNameArr[i] + '\n');
                if(output.length > 1800){
                    output = output.concat('```');
                    message.channel.send(output);
                    output = '```';
                }
            }
        }
        output = output.concat('```');
        message.channel.send(output);
    }
}    

async function sqlGetSteamNames(whereQuery){
    let sql=`SELECT * FROM cleetusbot.steamGames WHERE ${whereQuery} ORDER BY name asc;`;
    return new Promise((res, rej) => {
        global.pool.query(sql,function (err, results) {    
            if(err){
                console.log(`sqlGetSteamnames: ${err}`);
                rej(err);
            }
            else{
                res(results);
            }
        });
    });
}

async function sqlGetSteamId(discordid){
    let sql='SELECT steamId FROM cleetusbot.steamIds WHERE discordId='+discordid;
    return new Promise((res, rej) => {
        global.pool.query(sql, [discordid],function (err, results) {    
            if(err){
                console.log(`sqlGetSteamID: ${err}`);
                rej(err);
            }
            else{
                res(results[0].steamId);
            }
        });
    });
}
