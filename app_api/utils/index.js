/*http://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript*/
var moment = require('moment')
var tz = require('moment-timezone')
const random = () => {
  var text = "";
  var possible = "0123456789"; //ABCDEFGHIJKLMNOPQRSTUVWXYZ
  for( var i=0; i < 7; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

const timezone = () => {
  let fecha = moment();
  let current_time_guayaquil = moment(fecha.tz('America/Guayaquil').format())
  return current_time_guayaquil
}

module.exports = {
  random,
  timezone
}
