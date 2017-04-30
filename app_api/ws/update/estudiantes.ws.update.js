const diff = require('deep-diff').diff;
const jsondiff = require('jsondiffpatch')

var uno = [
  {
    nombres: 'joel',
    apellidos: 'rodriguez'
  },
  {
    nombres: 'andres',
    apellidos: 'miranda'
  },
  {
    nombres: 'carlos',
    apellidos: 'moreno'
  }
]

var dos = [
  {
    nombres: 'joel',
    apellidos: 'rodriguez'
  },
  {
    nombres: 'andres',
    apellidos: 'miranda'
  }
]
// left seria la db, rigth seria el ws
var differences = diff(dos, uno);

console.log(differences[0].item);
