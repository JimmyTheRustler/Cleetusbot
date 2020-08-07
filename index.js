const config = require("./config.json"); //contains token and prefix
const MySQL = require('mysql');
const Commando = require('discord.js-commando');
const client = new Commando.Client({
    commandPrefix: config.prefix,
    owner: '159477102960181248',
    disableEveryone: true,
    unknownCommandResponse: false
});

global.pool = MySQL.createPool({
  connectionLimit: config.database.connectionLimit,
  host: config.database.host,
  user: config.database.user,
  password:  config.database.password,
  database:  config.database.database
});

client.on("error", (e) => {
    var d = new Date();
    console.log("Error: " + e.message + " on " + d + ".");
});

//when ya boi logs in successfully
 client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  client.user.setActivity(`Raise hell and praise Dale brother YEEYEE`);
});

//when ya boi joins a server
client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});
//when ya boi is evicted from a soyboy server
client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});

client.registry.registerGroups([
    ['general', 'General Commands'],
    ['tunes', 'Tunes Commands'],
    ['memes', 'Meme Commands'],
    ['reddit', 'Reddit Commands'],
    ['nsfw', 'Nsfw Commands']
])
client.registry.registerDefaults();
client.registry.registerCommandsIn(__dirname +'/commands');


client.on("message", async message => {
  //ignores itself
  if(message.author.bot) return;
  //ignores all message's that does not start with definded prefix
  if(message.content.indexOf(config.prefix) !== 0) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

});

client.login(config.token);
