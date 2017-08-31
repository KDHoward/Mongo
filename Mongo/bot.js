var Model = require('./model');
var Scraper = require('./scraper');
var Pages = [];

function generateUrls(limit) {
    var url = 'http://localyellowpages.com/listing/';
    var urls = [];
    var i;
    for (i = 1; i < limit; i++) {
        urls.push(url + i);
    }
    return urls;
}

Pages = generateUrls(25000);

function wizard() {

    if (!Pages.length) {
        return console.log('Done!!!!');
    }
    var url = Pages.pop();
    var scraper = new Scraper(url);
    var model;
    console.log('Requests Left: ' + Pages.length);

    scraper.on('error', function(error) {
        console.log(error);
        wizard();
    });

    var numberOfParallelRequests = 20;
for (var i = 0; i < numberOfParallelRequests; i++) {
  wizard();
}

    scraper.on('complete', function(listing) {
        model = new Model(listing);

        model.save(function(err) {
            if (err) {
                console.log('Database err saving: ' + url);
            }
        });
        wizard();
    });
}
