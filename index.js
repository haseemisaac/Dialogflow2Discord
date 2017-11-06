const Discord = require('discord.js');
const client = new Discord.Client();
var apiai = require('apiai');
var config = require('./config');
var app = apiai(config.Dialogflow);
console.log(config);

client.on('ready', function(){
    console.log("I am ready");
    //console.log(client.user.username);
});

client.on('message', function(message){
        if((message.cleanContent.startsWith("@" + client.user.username) || message.channel.type == 'dm') && client.user.id != message.author.id){
        var mess = remove(client.user.username, message.cleanContent);
        console.log(mess);
        const user = message.author.id;
        var promise = new Promise(function(resolve, reject) {
            var request = app.textRequest(mess, {
                sessionId: user
            });
            request.on('response', function(response) {
                console.log(response);
                var rep = response.result.fulfillment.speech;
                resolve(rep);
            });

            request.on('error', function(error) {
                resolve(null);
            });

            request.end();
        });

        (async function(){
            var result = await promise;
            if(result){
                message.reply(result);
            } else{
                message.reply("nothing here");
            }
        }());

    }
});


function remove(username, text){
    return text.replace("@" + username + " ", "");
}

client.login(config.Discord);