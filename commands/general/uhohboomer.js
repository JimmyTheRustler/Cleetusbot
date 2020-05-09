const Commando = require('discord.js-commando');
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = class uhohboomer extends Commando.Command{
    constructor (client){
        super(client,{
            name: 'uhohboomer',
            group: 'general',
            memberName: 'uhohboomer',
            description: 'returns the number of cases for the boomer virus',
            examples:['./uhohboomer'],

        });
      }

      async run(message){
        const url = 'https://www.worldometers.info/coronavirus/';
        var output = [0,0,0];
        var fillCount = 0;
        axios(url)
          .then(response => {
            //console.log("------------------------------------------------------------");
            const html = response.data;
            const $ = cheerio.load(html);
            var maincounter = $('.maincounter-number').text();
            var count;
            var i;
            var j = 0;

            for(i = 0; i < maincounter.length; i++){
              count = count + maincounter[i];
            }
            count = count.split("\n")
            //console.log(count);


            // for(i = 0; i < count.length; i++){
            //   count[i] = parseInt(count[i], 10);
            //   if()
            // }

            // for(i = 0; i < count.length; i++){
            //   if(count[i].includes(',')){
            //     count[i] = count[i].replace(/,/g, "");
            //   }
            //   count[i] = parseInt(count[i], 10);
            // }

            for(i = 0; i < count.length; i++){
              if(count[i].includes(',')){
                output[j] = count[i];
                j++;
              }
            }


            // i = 0;
            // while(fillCount < 3 && i < count.length){
            //   if(count[i] > 1){
            //     output[fillCount] = count[i];
            //     fillCount++;
            //   }
            //   i++;
            // }

            message.channel.send('Live Covid-19 tally, \n'  +"total 🤒: " + output[0] + '\n'
                                       + "dead 💀: " + output[1] + '\n'
                                       + "recovered 😃: " + output[2]);
          })
          .catch(console.error);
      }
}
