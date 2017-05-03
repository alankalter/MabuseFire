var express = require('express');
var scrapes = require('./services');
var app     = express();
var mail = require('./mail.js');
var batch = require('./batchJob');
var cron = require('node-cron');
 
 cron.schedule('46 * * * *', batch.runBatch());




app.get('/scrape', function(req, res){
    // var ntasks_left_to_go = 4;
    
    // var callback = function(){
        
    //     // ntasks_left_to_go -= 1;
    //     // if(ntasks_left_to_go <= 0){
    //     //      console.log('All tasks have completed. Do your stuff');
    //     //      finish();
    //     // }

    //      tasks.shift();
    //      if(tasks.length <= 0){
    //         console.log('All tasks have completed. Do your stuff');
    //         finish();
    //         return;
    //         }

    //      scrapes[tasks[0]](writeDB, callback);
    // }



    // var result = scrapes[tasks[0]](writeDB, callback);
    // var result = scrapes.makeRequestEgyptian(false, callback);
    // var result = scrapes.makeRequestAero(false, callback);
    // var result = scrapes.makeRequestCineFamily(false, callback);

    // function finish (){
    //     // mail.sendMail();
    //     res.send("finished. check log.");
    // }
})

app.get('/scrape2', function(req, res){
})

app.get('/scrape3', function(req, res){
})


app.get('/scrape4', function(req, res){
})

app.get('/scrape5', function(req, res){
 url = 'http://thenewbev.com/schedule/';
    var horseman = new Horseman();
                var result = [];

        horseman
        .open(url)
        .html()
        .then(function(html){

                var $ = cheerio.load(html);

                $('.event-card').filter(function(){

                    var json = {};
                    var data = $(this);

                    var month = data.find('.event-card__month').text();
                    var day = data.find('.event-card__numb').text();
                    var year = data.closest('.calendar-month').find('h2').text().split(' ')[1];

                    var date = moment(month + "/" + day + "/" + year,'MMMM/DD/YYYY').format('MM/DD/YYYY');
                    var url = data.find('a').attr('href');

                    var titles = data.find('.event-card__title').text().replace('\n', '').split('/');
                    var times = [];
                    data.find(".event-card__time").filter(function(){
                        times.push($(this).text());
                    });

                        for (let i = 0; i < times.length; i++){
                            json.title = titles[i].trim();
                            json.time = times[i];


                            json.date = date;
                            json.url = url;
                            result.push(json);
                            json = {};
                        }
                    }
                )

        })
        .finally(function (){

            horseman.close();
            fs.writeFile('output.json', JSON.stringify(result, null, 4), function(err){

                console.log('File successfully written! - Check your project directory for the output.json file');

            })

            //Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
            res.send('Check your console!')

            var serviceAccount = require("mabuse-57164-firebase-adminsdk-gpl49-9ecec6dc84.json");

            admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://mabuse-57164.firebaseio.com"
            });

            var db = admin.database();
            var ref = db.ref("Theaters");

            var usersRef = ref.child("New Beverly");
            usersRef.set(result);
        });



})

app.get('/scrape6', function(req, res){
 url = 'http://rooftopcinemaclub.com/los-angeles/';

    request(url, function(error, response, html){

        if(!error){

                var $ = cheerio.load(html);

                var result = [];
                $('.js-event-item').filter(function(){
                    var json = {};
                    var data = $(this);
                    // result.push(data);
                            json.date = moment(data.attr('data-date'),'ddd MMM DD YYYY').format('MM/DD/YYYY');
                            json.url = data.find('a.overlay').attr('href') || 'http://rooftopcinemaclub.com/los-angeles/';
                            json.title = data.attr('data-film');
                            json.time = data.find("h6").first().text();
                        // console.log(json);
                            result.push(json);
                            json = {};
                })

            }
            fs.writeFile('output.json', JSON.stringify(result, null, 4), function(err){

                console.log('File successfully written! - Check your project directory for the output.json file');

            })

            // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
            res.send('Check your console!')

            var serviceAccount = require("mabuse-57164-firebase-adminsdk-gpl49-9ecec6dc84.json");

            admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://mabuse-57164.firebaseio.com"
            });

            var db = admin.database();
            var ref = db.ref("Theaters");

            var usersRef = ref.child("Rooftop Cinema Club (Montalban)");
            usersRef.set(result);
    })

})

app.get('/scrape7', function(req, res){
 url = 'https://www.cinema.ucla.edu/calendar';
    var horseman = new Horseman();
    var result = [];

        horseman
        .open(url)
        .html()
        .then(parsePage)
        .click("li[class='date-next'] > a")
        .waitForNextPage()
        .html()
        .then(parsePage)
        .finally(function (){

            horseman.close();

            writeToFile(result);

            //Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
            res.send('Check your console!');
            writeToDB(result, "UCLA Film & Television Archive");
        });

         function parsePage(html){

                var $ = cheerio.load(html);

                $('td.single-day').filter(function(){

                    var json = {};
                    var data = $(this);

                        if (!data.hasClass("empty") && !data.hasClass("no-entry")){


                            var date = moment(data.attr('data-date'),'YYYY-MM-DD').format('MM/DD/YYYY');

                            data.find('.item').filter(function(){
                                var subData = $(this);
                                json.url = 'https://www.cinema.ucla.edu' + subData.find('a').attr('href');
                                json.date = date;
                                json.title = subData.find('a').text();
                                json.time = subData.find('.date-display-single').text();
                                result.push(json);
                                json = {};
                            });

                        }
                    }
                )

        }

})

app.get('/scrape8', function(req, res){
 url = 'http://www.skirball.org/programs/film';

    request(url, parsePage)
    // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
    res.send('Check your console!')

        function parsePage(error, response, html){

                if(!error){

                        var $ = cheerio.load(html);

                        var result = [];
                        $('.results-list-detail').filter(function(){
                            var json = {};
                            var data = $(this);
                            var timeDate = data.find('p').first().text().split(',');
                                    json.time = timeDate[2].trim();
                                    json.date = moment(getDateWithDeterminedYear(timeDate[1]),'MMM DD YYYY').format('MM/DD/YYYY');
                                    json.url = 'http://www.skirball.org/programs' + data.find('h2 > a').attr('href'); ;
                                    json.title = data.find('h2 > a').text();
                                    result.push(json);
                                    json = {};
                        })

                    }

                    writeToFile(result);

                    writeToDB(result, "Skirball Cultural Center");

            }
})

app.get('/scrape9', function(req, res){
 url = 'http://www.eatseehear.com/event-schedule/category/eatseehear';
    var horseman = new Horseman();
    var result = [];

        horseman
        .open(url)
        .html()
        .then(parsePage)
        .finally(function (){

            horseman.close();

            writeToFile(result);

            //Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
            res.send('Check your console!');
            writeToDB(result, "Eat See Hear");
        });

         function parsePage(html){

                var $ = cheerio.load(html);

                $('.page-content .type-tribe_events').filter(function(){

                                var json = {};
                                var data = $(this);
                                var timeDate = data.find('.tribe-event-date-start').text().split('@');
                                var titleAnchor = data.find('.tribe-event-url');
                                var date = moment(getDateWithDeterminedYear(timeDate[0]),'MMM DD YYYY').format('MM/DD/YYYY');

                                json.url = titleAnchor.attr('href');
                                json.date = date;
                                json.title = titleAnchor.attr('title') ? titleAnchor.attr('title').replace('Eat|See|Hear Outdoor Movie:','').trim() : "";
                                json.time = timeDate[1].trim();
                                json.location = data.find('.tribe-events-venue-details > a').attr('title');
                                result.push(json);
                                json = {};


                    }
                )

        }

})

app.get('/scrape10', function(req, res){
 url = 'http://cinespia.org';
    var horseman = new Horseman({timeout: 50000});
    var result = [];

        horseman
        .open(url)
        .html()
        .then(parsePage)
        .finally(function (){

            horseman.close();

            writeToFile(result);

            //Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
            res.send('Check your console!');
            writeToDB(result, "Cinespia");
        });

         function parsePage(html){

                var $ = cheerio.load(html);

                $('.events').filter(function(){

                                var json = {};
                                var data = $(this);
                                var timeDateLoc = data.find('.events-meta-c > ul');
                                var date = timeDateLoc.find('li').first().text().split(',');
                                var location = timeDateLoc.find('li:nth-child(2)').text();
                                var time = timeDateLoc.find('li:nth-child(3)').text();
                                var titleAnchor = data.find('.events-header > a');
                                date = moment(getDateWithDeterminedYear(date[1], 'MMMM Do YYYY'),'MMM DD YYYY').format('MM/DD/YYYY');

                                json.url = titleAnchor.attr('href');
                                json.title = titleAnchor.find('h1').text();

                                json.date = date;
                                json.time = time;
                                json.location = location;
                                result.push(json);


                    }
                )

        }

})

app.get('/scrape11', function(req, res){
 url = 'http://www.lafilmforum.org/schedule/';
    var horseman = new Horseman();
    var result = [];

        horseman
        .open(url)
        .html()
        .then(parsePage)
        .finally(function (){

            horseman.close();

            writeToFile(result);

            //Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
            res.send('Check your console!');
            writeToDB(result, "LA Film Forum");
        });

         function parsePage(html){

                var $ = cheerio.load(html);

                $('.main ul li').filter(function(){

                                var json = {};
                                var data = $(this);
                                var titleAnchor = data.find('h2 > a');
                                var timeDateLoc = data.find('.date-time').text().split('\n');
                                var rawDate = timeDateLoc[0].replace('Date:', '').trim();
                                date = moment(getDateWithDeterminedYear(rawDate),'MMMM DD YYYY').format('MM/DD/YYYY');

                                json.url = 'http://www.lafilmforum.org' + titleAnchor.attr('href');
                                json.title = titleAnchor.attr('title');

                                json.date = date;
                                json.time = timeDateLoc[1].replace('Time:', '').trim();
                                json.location = timeDateLoc[2].replace('Location:', '').trim();
                                result.push(json);


                    }
                )

        }

})

app.get('/scrape12', function(req, res){
        url = 'http://www.streetfoodcinema.com/schedule/los-angeles/';
            var horseman = new Horseman({timeout: 50000});

        var scrapedData = [];

            horseman
            .open(url)
            .html()
            .then(getLinks)
            .then(function(links){

                workOneByOne(links, scrapeDataFromLink).then(function(result) {
                        scrapedData.push(result);
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify(scrapedData ));
                    }).finally(function (){

                    horseman.close();

                    writeToFile(scrapedData);
                    writeToDB(scrapedData, "Street Food Cinema");

                    //Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
                    res.send(scrapedData);
                })
            })

        function getLinks() {
            return horseman.evaluate(function () {
                var links = [];
                $('a.buy-btn').each(function (i, el) {
                    links.push($(el).attr('href'));
                });
                return links;
            });
        }

        function scrapeDataFromLink(link) {
            return horseman
            .open(link)
            .html()
            .then(parsePage)
        }


        function workOneByOne(items, someAsyncFuntionReturningPromise) {
            var lastResultPromise = items
                .map(function(item) {
                    return function(previousResult) {
                        if (previousResult) {
                            console.log(previousResult);
                            scrapedData.push(previousResult);
                        }

                        return someAsyncFuntionReturningPromise(item);
                    }})
                .reduce(Q.when, Q());

            return lastResultPromise;
        }


        function parsePage(html){

                var $ = cheerio.load(html);
                var json = {};
                var titleDate = $('.event-title');
                var rawDate = titleDate.find('.event-date').text();
                var timeLocInfo = $('.event-info');
                date = moment(rawDate,'MMMM DD, YYYY').format('MM/DD/YYYY');

                json.url = titleDate.find('a').attr('href');
                json.title = titleDate.find('a').attr('title');
                json.date = date;
                json.time = timeLocInfo.find('ul:nth-child(3) > li:nth-child(2)').text().split('\n').join(' ');
                json.location = timeLocInfo.find('ul:nth-child(4) a').text();
                return json;

        }
})

app.get('/scrape13', function(req, res){
 url = 'http://silverlakepictureshow.com/shows/';
    var horseman = new Horseman();
    var result = [];

        horseman
        .open(url)
        .html()
        .then(parsePage)
        .finally(function (){

            horseman.close();

            writeToFile(result);
            writeToDB(result, "Silverlake Picture Show");

            res.send(result);
        });

         function parsePage(html){

                var $ = cheerio.load(html);

                $('.type-tribe_events').filter(function(){

                                var json = {};
                                var data = $(this);
                                var titleAnchor = data.find('.tribe-events-list-event-title > a');
                                var rawDate = data.find('.tribe-events-event-date .mm').text() +  " " + data.find('.tribe-events-event-date .dd').text() + " " + data.find('.tribe-events-event-date .yy').text()
                                var date = moment(rawDate,'MMMM DD YYYY').format('MM/DD/YYYY');

                                json.url = titleAnchor.attr('href');
                                json.date = date;
                                json.title = titleAnchor.attr('title');
                                json.time = data.find('.time-details').text().trim();
                                json.location = data.find('.tribe-events-venue-details').text().trim();
                                result.push(json);
                                json = {};
                    }
                )

        }

})

app.get('/scrape14', function(req, res){
        url = 'http://www.echoparkfilmcenter.org/calendar/?category=3';
            var horseman = new Horseman({timeout: 50000});
            var $links = [];
            var scrapedData = [];

            horseman
            .open(url)
            .html()
            .then(getLinks)
            .then(function (links){
                $links = $links.concat(links);
                return links;
            })
            .click('.em-calnav-next')
            .waitForNextPage()
            .html()
            .then(getLinks)
            .then(function (links){
                $links = $links.concat(links);
                return links;
            })
            .then(
                function(){


                workOneByOne($links, scrapeDataFromLink)

                    .then(function(result) {
                        scrapedData.push(result);
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify(scrapedData));
                    }).finally(function (){

                    horseman.close();

                    writeToFile(scrapedData);
                    writeToDB(scrapedData, "Echo Park Film Center");

                    res.send(scrapedData);
                })
            }

            )

        function getLinks(html) {
            var links = [];
            var $ = cheerio.load(html);
             $('.eventful a').each(function (i, el) {
                    links.push($(el).attr('href'));
                });
                return links;
        }

        function scrapeDataFromLink(link) {
            return horseman
            .open(link)
            .html()
            .then(parsePage)
        }


        function workOneByOne(items, someAsyncFuntionReturningPromise) {
            var lastResultPromise = items
                .map(function(item) {
                    return function(previousResult) {

                        if (previousResult) {
                            console.log(previousResult);
                            scrapedData.push(previousResult);
                        }

                        return someAsyncFuntionReturningPromise(item);
                    }})
                .reduce(Q.when, Q());

            return lastResultPromise;
        }


        function parsePage(html){

            try {
                var url = horseman.targetUrl;
                var $ = cheerio.load(html);
                var json = {};

                var timeDate = $('.wysiwyg-content h3').text().replace('at', '').split(',');
                // console.log(timeDate);

                var dateObj = moment(getDateWithDeterminedYear(timeDate[1].trim() +" 2017", 'MMMM DD  h a YYYY'),'MM/DD/YYYY');
                date = dateObj.format('MM/DD/YYYY');

                json.url = url;
                json.title = $('.content .container > h2').text();
                json.date = date;
                json.time = dateObj.format('h a');
                return json;

            }
            catch (err){
                console.log(err);
            }

        }
})

app.get('/', function (req, res){

    res.send('main page')
})

app.listen('8081')

console.log('Magic happens on port 8081');

function writeToFile (resultArr){
    fs.writeFile('output.json', JSON.stringify(resultArr, null, 4), function(err){

                console.log('File successfully written! - Check your project directory for the output.json file');

            })
}

function writeToDB (resultArr, theaterName){
    var serviceAccount = require("mabuse-57164-firebase-adminsdk-gpl49-9ecec6dc84.json");

    admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://mabuse-57164.firebaseio.com"
    });

    var db = admin.database();
    var ref = db.ref("Theaters");

    var usersRef = ref.child(theaterName);
    usersRef.set(resultArr);
}

function getDateWithDeterminedYear (date, pattern = null){

  var current = new moment();
  var currentMonth = current.month();
  var dateObj = new moment(date, pattern).year(current.year());
  var dateMonth = dateObj.month();

  var result = dateObj;

  if((dateMonth < currentMonth)){
  		result = dateObj.add(1, 'year');
  }

  return result;
}



 


exports = module.exports = app;