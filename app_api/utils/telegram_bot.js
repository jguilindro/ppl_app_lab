// se cuante con tres tokens
// ppl_espol_bot = espol-ppl
// joelBot = localhost
// ppl-realtime = pagina ppl espol de prueba
var os = require('os')
var util = require('../ws/utils.ws.js');
var token = process.env.TOKEN || '283629476:AAG9qj1ZNMIgyARhSQ5bG9imNNjB8hBFKbM';
const options = {
  webHook: {
    port: process.env.PORT
  }
};
var TelegramBot = require('node-telegram-bot-api');

const url = process.env.APP_URL || 'https://ppl-realtime.herokuapp.com:443';

if(process.env.NODE_ENV === 'production') {
  const bot = new TelegramBot(token, options);
  bot.setWebHook(`${url}/bot${token}`);
}
else {
  bot = new TelegramBot(token, { polling: true });
}
console.log('Bot server started in the ' + process.env.NODE_ENV + ' mode');
bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];
  bot.sendMessage(chatId, `${resp} ${process.env.NODE_ENV} ${os.hostname()}`);
});

bot.onText(/\/ws (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const estudiante_user = match[1];
  var est = {}
  var bandera = true
  util.estudiantesWS(estudiantes => {
    if (estudiantes) {
      for (var i = 0; i < estudiantes.length; i++) {
        if (estudiantes[i].correo.split('@')[0] == estudiante_user) {
          bot.sendMessage(chatId,`${estudiantes[i].correo} ${estudiantes[i].nombres} ${estudiantes[i].apellidos}`);  //bot.sendMessage(parse_mode='HTML', chat_id=********, text='<b>test</b>')
          // bot.sendMessage(msg.chat.id, "<h1" + ">Hello</h1>", { parse_mode: "HTML" }).then(() => {
          //  });
          bandera = false
          break;
        }
      }
      if (bandera) {
        bot.sendMessage(chatId, 'no existe el estudiante')
      }
      return
    } else {
      bot.sendMessage(chatId, 'no valio');
    }
  })
});


bot.onText(/\/db (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const estudiante_user = match[1];
  var est = {}
  var bandera = true
  util.estudiantesDB(estudiantes => {
    if (estudiantes) {
      for (var i = 0; i < estudiantes.length; i++) {
        if (estudiantes[i].correo.split('@')[0] == estudiante_user) {
          bot.sendMessage(chatId,`${estudiantes[i].correo} ${estudiantes[i].nombres} ${estudiantes[i].apellidos}`);
          bandera = false
          break;
        }
      }
      if (bandera) {
        bot.sendMessage(chatId, 'no existe el estudiante')
      }
      return
    } else {
      bot.sendMessage(chatId, 'no valio');
    }
  })
});

module.exports.bot = bot

// bot.on('message', function onMessage(msg) {
//   console.log(msg.text);
//   bot.sendMessage(msg.chat.id, 'I am alive on Heroku!');
// });
