const Discord = require('discord.js');
const client = new Discord.Client();
const dialogflow = require('dialogflow')
client.on('ready', function(){
  console.log("I am ready");
});

client.on('message', async message => {
  if((message.cleanContent.startsWith("@" + client.user.username) || message.channel.type == 'dm') && client.user.id != message.author.id){
    var mess = remove(client.user.username, message.cleanContent);
    console.log(mess);
    const user = message.author.id;
    const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');
    const clientEmail = process.env.CLIENT_EMAIL
    let config = {
      credentials: {
        private_key: privateKey,
        client_email: clientEmail
      }
    }
    const sessionClient = new dialogflow.SessionsClient(config)
    const sessionPath = sessionClient.sessionPath(process.env.PROJECT_ID, user)
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: mess,
          languageCode: "en-US",
        }
      }
    };
    const response = await sessionClient.detectIntent(request);
    const rep = response[0].queryResult.fulfillmentText  //Default response
    message.reply(rep)
  }
});
function remove(username, text) {
  return text.replace('@' + username + ' ', '');
};
client.login(process.env.BOT)  
