var soap = require('soap');
 var url = 'http://ws.espol.edu.ec/saac/wsSODIS.asmx?WSDL';
 var parseString = require('xml2js').parseString;
 // var url = 'http://www.webservicex.net/country.asmx?WSDL'
 var args = {'username': 'joeedrod'};
 soap.createClient(url, function(err, client) {
  //  console.log(client);
  // console.log(typeof client);
     client.DatosEstudianteUsuario(args, function(err, result,raw, s) {
       console.log(raw);
       var match = raw.match(/<NOMBRES>(.+?)<\/NOMBRES>/g)
       console.log(match);
      //  parseString(raw, function (err, result) {
      //       console.dir(result['soap:Envelope']['soap:Body']);
      //   });
      //  console.log(result);
        //  console.log(result.wsConsultaProfesoresResult.schema);
     });
 });

// var express = require('express')
//
// app = express()
//
// app.post('http://ws.espol.edu.ec/saac/wsPPL.asmx/HelloWorld', (req, res) => {
//   console.log('sdf');
//   console.log(res);
// })
// var request = require('request');
// request.get('http://www.webservicex.net/country.asmx/GetCountries?ecua', function (error, response, body) {
//   console.log('error:', error); // Print the error if one occurred
//   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//   console.log('body:', body); // Print the HTML for the Google homepage.
// });
