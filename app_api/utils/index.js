/*http://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript*/
const random = () => {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < 6; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

module.exports = {
  random
}
