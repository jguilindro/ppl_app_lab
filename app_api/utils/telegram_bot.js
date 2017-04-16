var token = process.env.TOKEN || '283629476:AAG9qj1ZNMIgyARhSQ5bG9imNNjB8hBFKbM';
const options = {
  webHook: {
    port: process.env.PORT
  }
};
var TelegramBot = require('node-telegram-bot-api');

const url = process.env.APP_URL || 'https://ppl-espol.herokuapp.com:443';

if(process.env.NODE_ENV === 'production') {
  //bot = new Bot(token);
  const bot = new TelegramBot(token, options);
  bot.setWebHook(`${url}/bot${token}`);
  //bot.setWebHook(process.env.HEROKU_URL + token);
}
else {
  bot = new TelegramBot(token, { polling: true });
}

console.log('Bot server started in the ' + process.env.NODE_ENV + ' mode');

// bot.onText(/^/, function (msg) {
//   var name = msg.from.first_name;
//   bot.sendMessage(msg.chat.id, 'Hello, ' + name + '!').then(function () {
//     // reply sent!
//   });
// });
bot.on('message', function onMessage(msg) {
  bot.sendMessage(msg.chat.id, 'I am alive on Heroku!');
});
