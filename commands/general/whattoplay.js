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
            examples:['./whattoplay @discorduser1 @discorduser2 @discorduser3'],
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
        /* convert discord names from strings to user objects */
        let users = [];
        let username = [];
        let usersDirty = args.users.split(' ');
        let subUsers = usersDirty.map((user) => user.substring(3,user.length - 1));
        let userObjs = subUsers.map((subUser) => this.client.users.get(subUser));
        /* For loop to clean input. Only take valid discord users */
       for(let i = 0; i < userObjs.length; i++){
            if(userObjs[i] !== undefined){
                users.push(userObjs[i].id);
                username.push(userObjs[i].username);
            }
        }
        let usrPromises = [];
        let steamIds = [];
        /* SQL query to steamIds table to cross-reference discord Id's to Steam Id's */
        usrPromises = users.map(id => sqlGetSteamId(id));
        steamIds = await Promise.all(usrPromises);

        
        let steamObjArr = [];
        usrPromises = [];        
        /* returns all steam user objects to array */
        usrPromises = steamIds.map(id => fetch(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${config.steamKey}&steamid=${id}&format=json`).then(res => res.json()));
        steamObjArr = await Promise.all(usrPromises);

        let gameList = [];
        let tmpGameList = [];
        /* For loop to loop through steamObjArray and compile a list of similar games everyone owns */
        for(let i = 0; i < steamObjArr.length; i++){
            //check to see if steam user has their game collection public, if private print if
            if(_.isEmpty(steamObjArr[i].response)){
                message.channel.send(`Uh Oh! Looks like ${username[i]} is a big pussy and has their account set to private! Skipping their games...`);
            }
            else{
                /* if master game list is empty then we must be checking the first person in the array.
                    Since first person append their entire game library to master game list
                 */
                if(!Array.isArray(gameList) || !gameList.length){
                    for(let j = 0; j < steamObjArr[i].response.game_count; j++){
                        gameList.push(steamObjArr[i].response.games[j].appid);
                    }
                }
                /* else add user game list to a temp array, compare temp array and master array to find
                    what entries are duplicates and remove the unique entries. Then update master array
                    with all games found in both lists. */
                else{
                    for(let h = 0; h < steamObjArr[i].response.game_count; h++){
                        tmpGameList.push(steamObjArr[i].response.games[h].appid);
                    }
                    gameList = _.intersection(gameList, tmpGameList);
                    tmpGameList = [];
                }
            }
        }     
        /* For loop to create a SQL query of all game app Id's people have in common, example:
            appId=123 OR appId=124 OR appId=125 */
        let sqlWhereQuery = '';
        for(let i = 0; i < gameList.length; i++){
            sqlWhereQuery = sqlWhereQuery.concat(`appId=${gameList[i]}`);
            if(i !== gameList.length-1){
                sqlWhereQuery = sqlWhereQuery.concat(' OR ');
            }
        }

        let steamNameObj;
        //if gamelist is empty then return 'No Games Found'
        if(gameList.length === 0){
            message.channel.send('No games found');
        }
        else{
            usrPromises = [];
            /* steamNameObj gets returned object from sqlGetSteamNames that cross-referenced steam app Id's to 
                steam game names
             */
            steamNameObj = await sqlGetSteamNames(sqlWhereQuery);
        }


        let steamNameArr = [];
        //For Loop to grab all steam game names and push them to array
        for(let i = 0; i < steamNameObj.length; i++){
            steamNameArr.push(steamNameObj[i].name);
        }
        //Double checks to make sure theres no duplicate entries
        const uniqueSteamNames = new Set(steamNameArr);
        steamNameArr = [...uniqueSteamNames];

        let output='```';
        //If steamName Array is empty for some reason output error
        if(steamNameArr.length === 0){
            output = output.concat('Error retrieving game name list...');
        }
        /* loop that compiles string with game list to send in discord chat */
        else{
            for(let i = 0; i < steamNameArr.length; i++){
                output = output.concat(i+1 + '. ' + steamNameArr[i] + '\n');
                //discord has a max of 2000 chars per message, this cuts up list into multiple messages if length is too long
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
