const Commando = require('discord.js-commando');

module.exports = class bot extends Commando.Command{
    constructor (client){
        super(client,{
            name: '8ball',
            group: 'general',
            memberName: '8ball',
            description: 'Ask the 8-ball a question to find its responce.',
            examples:['./8ball'],
            args: [
                {
                    key: 'input',
                    prompt: 'Ask a question',
                    type: 'string' 
                } 
            ]
        });
    }
    async run(message, args){
        
        var randNum = Math.round(Math.random() * 20);
        var ans = ["As I see it, yes.",
                    "Ask again later.",
                    "Better not tell you now.",
                    "Cannot predict now.",
                    "Concentrate and ask again.",
                    "Don’t count on it.",
                    "It is certain.",
                    "It is decidedly so.",
                    "Most likely.",
                    "My reply is no.",
                    "My sources say no.",
                    "Outlook not so good.",
                    "Outlook good.",
                    "Reply hazy, try again.",
                    "Signs point to yes.",
                    "Very doubtful.",
                    "Without a doubt.",
                    "Yes.",
                    "Yes – definitely.",
                    "You may rely on it."];
        var output = "```" + args.input + "```\n" + ans[randNum];
        message.channel.send(output);

    }
}
