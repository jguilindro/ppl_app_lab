/**
 * Created by pc on 28/05/2017.
 */
var json2csv = require('json2csv');
var fs = require('fs');
var fields = ['car.make', 'car.model', 'price', 'color'];
var myCars = [
    {
        "car": {"make": "Audi", "model": "A3"},
        "price": 40000,
        "color": "blue"
    }, {
        "car": {"make": "BMW", "model": "F20"},
        "price": 35000,
        "color": "black"
    }, {
        "car": {"make": "Porsche", "model": "9PA AF1"},
        "price": 60000,
        "color": "green"
    }
];
var csv = json2csv({ data: myCars, fields: fields });

fs.writeFile('file.csv', csv, function(err) {
    if (err) throw err;
    console.log('file saved');
});