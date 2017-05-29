// yarn casperjs --ssl-protocol=tlsv1 test/o.js
var casper = require('casper').create();
casper.start('ppl-realtime.herokuapp.com');

casper.then(function() {
    this.echo('First Page: ' + this.getTitle());
});

casper.thenOpen('http://phantomjs.org', function() {
    this.echo('Second Page: ' + this.getTitle());
});

casper.run();
