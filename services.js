var cheerio = require('cheerio');
var moment = require('moment');
var Horseman = require('node-horseman');
var q = require('q');
var db = require('./db');
var helpers = require('./helpers');

const log4js = require('log4js');

log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('logs/mabuseFire.log'), 'mabuseFire');

const logger = log4js.getLogger('mabuseFire');

function Lacma (writeToDb, callback) {  
    
    try {
        logger.info("beginning Lacma Request/parse");
        
        var url = 'http://www.lacma.org/events-calendar?tid=68';

        var horseman = new Horseman();
        var result = [];

        horseman
        .open(url)
        .catch(function (msg){
            logger.error(msg);
        })
        .html()
        .then(parsePage)
        .finally(function (){

            horseman.close();
            logger.info('RESULT ARRAY');
            logger.info(result);            
            
            if (writeToDb){
                db.writeToDB(result, "Lacma");
            }
            logger.info("ending Lacma Request/parse");
            
            
            callback();            
            return result;
        });
        
    }
    catch (err){
        logger.error("horseman block error!");
    }

        function parsePage(html){

            try {
                var $ = cheerio.load(html);

                $('div.events').filter(function(){
                        var json = {};
                        var data = $(this);

                        json.date = data.find('h4').first().text();

                        var titleAndUrlNode = data.find('a.title');

                        var title = titleAndUrlNode.first().contents().filter(function() {
                            return this.type === 'text';
                        }).text();
                        json.title = title.trim();

                        json.url = "http://www.lacma.org/" + titleAndUrlNode.attr('href');

                        var timeDate = data.find('div.details').first().text().replace(/[|_]/g,'').trim().split("  ");

                        json.time = moment(timeDate[0].trim(), 'hh:mm A').format('hh:mm A');
                        json.date = moment(timeDate[1].trim(), 'ddd, MMM D, YYYY').format('MM/DD/YYYY');
                        json.timeDate = timeDate;
                        result.push(json);
                });
            }
            catch(err) {
                logger.error("parser error!")
                logger.error(err);

            }
        }
}

function Egyptian (writeToDb, callback){    

            try {
                logger.info("beginning Egyptian Request/parse");


                var url = 'http://www.americancinemathequecalendar.com/calendar_egyptian';

                var horseman = new Horseman();
                var result = [];

                horseman
                .open(url)
                .catch(function (msg){
                    logger.error(msg);
                })
                .html()
                .then(parsePage)
                .click("div[class='date-next'] > span > a")
                .waitForNextPage()
                .html()
                .then(parsePage)
                .finally(function (){

                    horseman.close();
                    logger.info('RESULT ARRAY');
                    logger.info(result);
                    
                    
                    
                    if (writeToDb){
                        db.writeToDB(result, "Egyptian Theater");
                    }
                    logger.info("ending Egyptian Request/parse");
                    
                    
                    callback();            
                });
        return result;
                
                
            }
            catch (err){
                logger.error("horseman block error!");
            }                
            

        function parsePage(html){
        try {
            var $ = cheerio.load(html);

            $('div.month-view td').filter(function(){
                    var json = {};
                    var data = $(this);
                    

                    if (!data.hasClass("empty")){

                    var date = moment(data.attr('id').replace('calendar-', ''),'YYYY-MM-DD').format('MM/DD/YYYY');
                        

                        $(data).find('.inner .view-item').filter(function(){

                            var item = $(this).find(".view-field a");
                            json.date = date;
                            json.url = 'http://www.americancinemathequecalendar.com' + item.attr("href");
                            json.title = item.text();
                            json.time = $(this).find(".date-display-single").text();
                            result.push(json);
                            json = {};
                        });
                    }
                })

                }
        catch(err) {
            logger.error("parser error!")
            logger.error(err);

        }
            }

}

function Aero (writeToDb, callback){ 

            try {
                logger.info("beginning Aero Request/parse");

                var url = 'http://www.americancinemathequecalendar.com/calendar_aero';
                var horseman = new Horseman();
                var result = [];

                horseman
                .open(url)
                .catch(function (msg){
                    logger.error(msg);
                })
                .html()
                .then(parsePage)
                .click("div[class='date-next'] > span > a")
                .waitForNextPage()
                .html()
                .then(parsePage)
                .finally(function (){

                    horseman.close();
                    logger.info('RESULT ARRAY');
                    logger.info(result);
                    
                    
                    
                    if (writeToDb){
                        db.writeToDB(result, "Aero Theater");
                    }
                    logger.info("ending Aero Request/parse");
                    
                    
                    callback();            
                });
        return result;
                
                
            }
            catch (err){
                logger.error("horseman block error!");
            }                
            

        function parsePage(html){
            try {
            var $ = cheerio.load(html);

            $('div.month-view td').filter(function(){
                    var json = {};
                    var data = $(this);
                    

                    if (!data.hasClass("empty")){

                    var date = moment(data.attr('id').replace('calendar-', ''),'YYYY-MM-DD').format('MM/DD/YYYY');
                        

                        $(data).find('.inner .view-item').filter(function(){

                            var item = $(this).find(".view-field a");
                            json.date = date;
                            json.url = 'http://www.americancinemathequecalendar.com' + item.attr("href");
                            json.title = item.text();
                            json.time = $(this).find(".date-display-single").text();
                            result.push(json);
                            json = {};
                        });
                    }
                })
                }
            catch(err) {
                logger.error("parser error!")
                logger.error(err);

            }
            }

}

function CineFamily(writeToDb, callback){
        
    try {
        logger.info("beginning Cinefamily Request/parse");


        var url = 'http://www.cinefamily.org/#calendar';
        var horseman = new Horseman({timeout: 50000});
        var result = [];

        horseman
        .open(url)
        .html()
        .then(parsePage)
        .click("span[id='EC_nextMonthLarge']")
        .wait('5000')
        .html()
        .then(parsePage)
        
        .finally(function (){

                    horseman.close();
                    logger.info('RESULT ARRAY');
                    logger.info(result);
                    
                    if (writeToDb){
                        db.writeToDB(result, "Cinefamily");
                    }
                    logger.info("ending Cinefamily Request/parse");
                    
                    
                    callback();            
                });
        return result;
    }
    catch (err){
        logger.error("horseman block error!");
        if (err) logger.error(err);
    }
        function parsePage(html){

                var $ = cheerio.load(html);
                var currentMonthYear = $('#CalendarLarge-Header').find("#EC_current-month");
                var currentMonth = currentMonthYear.find("cufon").first().find("cufontext").text();
                var currentYear = currentMonthYear.find("cufon:nth-child(2) > cufontext").text();

                $('#wp-calendarLarge td').filter(function(){

                    var json = {};
                    var data = $(this);
                    
                    var date = moment(currentMonth + "/" + data.find('div.dayHead').text() + "/" + currentYear,'MMMM/DD/YYYY').format('MM/DD/YYYY');

                        data.find('span.event-block').filter(function(){
                            var item = $(this).find(".EC-tt-title-link");
                            json.date = date;
                            json.url = item.attr("href");
                            json.title = item.text();
                            json.time = $(this).find("small").text();

                        if(json.date != ""){
                            result.push(json);
                        }
                            json = {};
                        });
                    }
                )
        }
}

function NewBeverly(writeToDb, callback){
        
    try {
        logger.info("beginning New Beverly Request/parse");

        var url = 'http://thenewbev.com/schedule/';
        var horseman = new Horseman();
        var result = [];

        horseman
        .open(url)
        .html()
        .then(parsePage)
        .finally(function (){

                    horseman.close();
                    logger.info('RESULT ARRAY');
                    logger.info(result);
                    
                    if (writeToDb){
                        db.writeToDB(result, "New Beverly");
                    }
                    logger.info("ending New Beverly Request/parse");
                    
                    
                    callback();            
        });
    }
    catch (err){
        logger.error("horseman block error!");
        if (err) logger.error(err);
    }

    function parsePage(html){

            try {
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
                }
            catch(err) {
                logger.error("parser error!")
                logger.error(err);

            }
    }
}

function RooftopCinemaClub (writeToDb, callback) {

    try {
        logger.info("beginning Rooftop Cinema Request/parse");

        var url = 'http://rooftopcinemaclub.com/los-angeles/';
        var horseman = new Horseman();
        var result = [];

        horseman
        .open(url)
        .html()
        .then(parsePage)
        .finally(function (){

                    horseman.close();
                    logger.info('RESULT ARRAY');
                    logger.info(result);
                    
                    if (writeToDb){
                        db.writeToDB(result, "Rooftop Cinema");
                    }
                    logger.info("ending Rooftop Cinema Request/parse");                    
                    
                    callback();            
        });
    }
    catch (err){
        logger.error("horseman block error!");
        if (err) logger.error(err);
    }


    function parsePage (html){
        try{
            var $ = cheerio.load(html);
            $('.js-event-item').filter(function(){
                        var json = {};
                        var data = $(this);
                        json.date = moment(data.attr('data-date'),'ddd MMM DD YYYY').format('MM/DD/YYYY');
                        json.url = data.find('a.overlay').attr('href') || 'http://rooftopcinemaclub.com/los-angeles/';
                        json.title = data.attr('data-film');
                        json.time = data.find("h6").first().text();
                        result.push(json);
                        json = {};
            })            
        }
    
        catch(err) {
            logger.error("parser error!")
            logger.error(err);
        }
    }
}

function UCLAFilmandTV (writeToDb, callback){

    try {
            logger.info("beginning UCLAFilmandTV Request/parse");
            var url = 'https://www.cinema.ucla.edu/calendar';
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
                    logger.info('RESULT ARRAY');
                    logger.info(result);
                    
                    if (writeToDb){
                        db.writeToDB(result, "UCLA Film & Television Archive");
                    }
                    logger.info("ending Rooftop Cinema Request/parse");                    
                    
                    callback();  
                });

            }
    catch (err){
        logger.error("horseman block error!");
        if (err) logger.error(err);
    }

         function parsePage(html){
                try{
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
                        })
                    }
                catch(err) {
                    logger.error("parser error!")
                    logger.error(err);
                }

        }

}

function SkirballCenter (writeToDb, callback){
    try{
        logger.info("beginning Skirball Cultural Center Request/parse");
    
        var url = 'http://www.skirball.org/programs/film';

        var horseman = new Horseman();
        var result = [];

        horseman
        .open(url)
        .html()
        .then(parsePage)
        .finally(function (){

                    horseman.close();
                    logger.info('RESULT ARRAY');
                    logger.info(result);
                    
                    if (writeToDb){
                        db.writeToDB(result, "Skirball Cultural Center");
                    }
                    logger.info("ending Skirball Cultural Center Request/parse");                    
                    
                    callback();            
        });
        }
    catch (err){
        logger.error("horseman block error!");
        if (err) logger.error(err);
    }
   

            function parsePage(html){
                try{
                        var $ = cheerio.load(html);
                        
                        $('.results-list-detail').filter(function(){
                            var json = {};
                            var data = $(this);
                            var timeDate = data.find('p').first().text().split(',');
                                    json.time = timeDate[2].trim();
                                    json.date = moment(helpers.getDateWithDeterminedYear(timeDate[1]),'MMM DD YYYY').format('MM/DD/YYYY');
                                    json.url = 'http://www.skirball.org/programs' + data.find('h2 > a').attr('href'); ;
                                    json.title = data.find('h2 > a').text();
                                    result.push(json);
                            })
                        }
    
                catch(err) {
                    logger.error("parser error!")
                    logger.error(err);
                }

            }
}

function EatSeeHear (writeToDb, callback){
    try {
        logger.info("beginning EatSeeHear Request/parse");
        
        var url = 'http://www.eatseehear.com/event-schedule/category/eatseehear';
        var horseman = new Horseman({timeout: 50000});
        var result = [];

            horseman
            .open(url)
            .html()
            .then(parsePage)
            .finally(function (){

                horseman.close();
                logger.info('RESULT ARRAY');
                logger.info(result);
                
                if (writeToDb){
                    db.writeToDB(result, "Eat See Hear");
                }
                logger.info("ending Eat See Hear Request/parse");                    
                
                callback();  
            });
    }
    catch (err){
        logger.error("horseman block error!");
        if (err) logger.error(err);
    }

         function parsePage(html){
            try {
                var $ = cheerio.load(html);

                $('.page-content .type-tribe_events').filter(function(){

                                var json = {};
                                var data = $(this);
                                var timeDate = data.find('.tribe-event-date-start').text().split('@');
                                var titleAnchor = data.find('.tribe-event-url');
                                var date = moment(helpers.getDateWithDeterminedYear(timeDate[0]),'MMM DD YYYY').format('MM/DD/YYYY');

                                json.url = titleAnchor.attr('href');
                                json.date = date;
                                json.title = titleAnchor.attr('title') ? titleAnchor.attr('title').replace('Eat|See|Hear Outdoor Movie:','').trim() : "";
                                json.time = timeDate[1].trim();
                                json.location = data.find('.tribe-events-venue-details > a').attr('title');
                                result.push(json);
                    })
            }    
            catch(err) {
                logger.error("parser error!")
                logger.error(err);
            }

        }
}

function Cinespia (writeToDb, callback){
   try {
    logger.info("beginning Cinespia Request/parse");
       
    var url = 'http://cinespia.org';
    var horseman = new Horseman({timeout: 50000});
    var result = [];

        horseman
        .open(url)
        .html()
        .then(parsePage)
        .finally(function (){
            

            horseman.close();
                    logger.info('RESULT ARRAY');
                    logger.info(result);
                    
                    if (writeToDb){
                        db.writeToDB(result, "Cinespia");
                    }
                    logger.info("ending Cinespia Request/parse");                    
                    
                    callback(); 
        });

        }
        catch (err){
        logger.error("horseman block error!");
        if (err) logger.error(err);
        }

         function parsePage(html){
            try{
                var $ = cheerio.load(html);

                $('.events').filter(function(){

                                var json = {};
                                var data = $(this);
                                var timeDateLoc = data.find('.events-meta-c > ul');
                                var date = timeDateLoc.find('li').first().text().split(',');
                                var location = timeDateLoc.find('li:nth-child(2)').text();
                                var time = timeDateLoc.find('li:nth-child(3)').text();
                                var titleAnchor = data.find('.events-header > a');
                                date = moment(helpers.getDateWithDeterminedYear(date[1], 'MMMM Do YYYY'),'MMM DD YYYY').format('MM/DD/YYYY');

                                json.url = titleAnchor.attr('href');
                                json.title = titleAnchor.find('h1').text();

                                json.date = date;
                                json.time = time;
                                json.location = location;
                                result.push(json);


                    })

            }    
            catch(err) {
                logger.error("parser error!")
                logger.error(err);
            }
        }


}

function LAFilmForum (writeToDb, callback){
    try {
        logger.info("beginning LA Film Forum Request/parse");
        
        var url = 'http://www.lafilmforum.org/schedule/';
        var horseman = new Horseman();
        var result = [];

            horseman
            .open(url)
            .html()
            .then(parsePage)
            .finally(function (){
                horseman.close();
                logger.info('RESULT ARRAY');
                logger.info(result);
                
                if (writeToDb){
                    db.writeToDB(result, "LA Film Forum");
                }
                logger.info("ending LA Film Forum Request/parse");                    
                
                callback();               
            });

        }
    catch (err){
    logger.error("horseman block error!");
    if (err) logger.error(err);
    }

         function parsePage(html){
            try {
                var $ = cheerio.load(html);

                $('.main ul li').filter(function(){

                                var json = {};
                                var data = $(this);
                                var titleAnchor = data.find('h2 > a');
                                var timeDateLoc = data.find('.date-time').text().split('\n');
                                var rawDate = timeDateLoc[0].replace('Date:', '').trim();
                                date = moment(helpers.getDateWithDeterminedYear(rawDate),'MMMM DD YYYY').format('MM/DD/YYYY');

                                json.url = 'http://www.lafilmforum.org' + titleAnchor.attr('href');
                                json.title = titleAnchor.attr('title');

                                json.date = date;
                                json.time = timeDateLoc[1].replace('Time:', '').trim();
                                json.location = timeDateLoc[2].replace('Location:', '').trim();
                                result.push(json);


                    }
                )
                }    
            catch(err) {
                logger.error("parser error!")
                logger.error(err);
            }

        }

}

function StreetFoodCinema (writeToDb, callback){
        try {
            logger.info("beginning Street Food Cinema Request/parse");
            var url = 'http://www.streetfoodcinema.com/schedule/los-angeles/';
            var horseman = new Horseman({timeout: 50000});

            var scrapedData = [];

            horseman
            .open(url)
            .html()
            .then(getLinks)
            .then(function(links){

                workOneByOne(links, scrapeDataFromLink)
                    .then(function(result) {
                        scrapedData.push(result);
                    }).finally(function (){

                        horseman.close();
                        logger.info('RESULT ARRAY');
                        logger.info(scrapedData);
                        
                        if (writeToDb){
                            db.writeToDB(scrapedData, "Street Food Cinema");
                        }
                        logger.info("ending Street Food Cinema Request/parse");                    

                        callback();
                         
                })
            })
            
            }
        catch (err){
            logger.error("horseman block error!");
            if (err) logger.error(err);
        }

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
                            // console.log(previousResult);
                            scrapedData.push(previousResult);
                        }

                        return someAsyncFuntionReturningPromise(item);
                    }})
                .reduce(q.when, Q());

            return lastResultPromise;
        }


        function parsePage(html){
                try {
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
                catch(err) {
                    logger.error("parser error!")
                    logger.error(err);
                 }

        }
}


function SilverLakePictureShow (writeToDb, callback){
    try {
        logger.info("beginning SilverLakePictureShow Request/parse");
        
        var url = 'http://silverlakepictureshow.com/shows/';
        var horseman = new Horseman();
        var result = [];

            horseman
            .open(url)
            .html()
            .then(parsePage)
            .finally(function (){


                horseman.close();
                logger.info('RESULT ARRAY');
                logger.info(result);
                
                if (writeToDb){
                    db.writeToDB(result, "Silverlake Picture Show");
                }
                logger.info("ending LA Film Forum Request/parse");                    
                
                callback();
            });
    }
        catch (err){
        logger.error("horseman block error!");
        if (err) logger.error(err);
    }

         function parsePage(html){
            try {
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
                    })
            }
            catch(err) {
                logger.error("parser error!")
                logger.error(err);
            }

        }

}

function EchoParkFilmCenter (writeToDb, callback){
    try {
            logger.info("beginning EchoParkFilmCenter Request/parse");
            var url = 'http://www.echoparkfilmcenter.org/calendar/?category=3';
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
                    }).finally(function (){

                        horseman.close();
                        logger.info('RESULT ARRAY');
                        logger.info(scrapedData);
                        
                        if (writeToDb){
                            db.writeToDB(scrapedData, "Echo Park Film Center");
                        }
                        logger.info("ending Echo Park Film Center Request/parse");                    

                        callback();
                })
            })
            }
    catch (err){
        logger.error("horseman block error!");
        if (err) logger.error(err);
    }

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
                            scrapedData.push(previousResult);
                        }

                        return someAsyncFuntionReturningPromise(item);
                    }})
                .reduce(q.when, Q());

            return lastResultPromise;
        }


        function parsePage(html){

            try {
                var url = horseman.targetUrl;
                var $ = cheerio.load(html);
                var json = {};

                var timeDate = $('.wysiwyg-content h3').text().replace('at', '').split(',');

                var dateObj = moment(helpers.getDateWithDeterminedYear(timeDate[1].trim() +" 2017", 'MMMM DD  h a YYYY'),'MM/DD/YYYY');
                date = dateObj.format('MM/DD/YYYY');

                json.url = url;
                json.title = $('.content .container > h2').text();
                json.date = date;
                json.time = dateObj.format('h a');
                return json;

            }
            catch(err) {
                    logger.error("parser error!")
                    logger.error(err);
            }

        }
}



module.exports = {
    Lacma : Lacma, 
    Egyptian : Egyptian,
    Aero : Aero,
    CineFamily : CineFamily,
    NewBeverly : NewBeverly,
    RooftopCinemaClub : RooftopCinemaClub,
    UCLAFilmandTV : UCLAFilmandTV,
    SkirballCenter : SkirballCenter, 
    EatSeeHear: EatSeeHear,
    Cinespia : Cinespia,
    LAFilmForum : LAFilmForum,
    StreetFoodCinema : StreetFoodCinema,
    SilverLakePictureShow : SilverLakePictureShow,
    EchoParkFilmCenter : EchoParkFilmCenter
}
