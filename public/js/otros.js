// function salir(name) {
//     // This function will attempt to remove a cookie from all paths.
//     var pathBits = location.pathname.split('/');
//     var pathCurrent = ' path=';
//
//     // do a simple pathless delete first.
//     document.cookie = name + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT;';
//
//     for (var i = 0; i < pathBits.length; i++) {
//         pathCurrent += ((pathCurrent.substr(-1) != '/') ? '/' : '') + pathBits[i];
//         document.cookie = name + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT;' + pathCurrent + ';';
//     }
// }
function salir() {
  window.location.href = '/api/session/logout'
//   var cookies = document.cookie.split(";");
// for (var i = 0; i < cookies.length; i++)
//   eraseCookie(cookies[i].split("=")[0]);
};

(function() {
  var cookies = document.cookie.split(";");
for (var i = 0; i < cookies.length; i++)
  eraseCookie(cookies[i].split("=")[0]);
})
