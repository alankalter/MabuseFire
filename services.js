var fs = require('fs');
var cheerio = require('cheerio');
var moment = require('moment');
var Horseman = require('node-horseman');
var Q = require('Q');
var db = require('./db');

const log4js = require('log4js');

log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('logs/mabuseFire.log'), 'mabuseFire');

const logger = log4js.getLogger('mabuseFire');

function makeRequestLacma (writeToDb, callback) {  
    
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
            
            writeToFile(result);
            
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

function makeRequestEgyptian (writeToDb, callback){    

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
                    
                    writeToFile(result);
                    
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

}

function makeRequestAero (writeToDb, callback){

 

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
                    
                    writeToFile(result);
                    
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

}

function makeRequestCineFamily(writeToDb, callback){
        
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
                    
                    writeToFile(result);
                    
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




function writeToFile (resultArr){
    if (resultArr.length > 0){
    fs.writeFile('output.json', JSON.stringify(resultArr, null, 4), function(err){
                    if (err){
                        console.log(err);
                        logger.error(err);
                    }
                    else{
                    logger.info('File successfully written');
                    console.log('File successfully written!');
                    }
                })
    }
    else {
        logger.error('empty result array, no file written');
    }
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

var allJobs =
[
"makeRequestLacma",
"makeRequestEgyptian",
"makeRequestAero",
"makeRequestCineFamily"
];

module.exports.makeRequestLacma = makeRequestLacma; 
module.exports.makeRequestEgyptian = makeRequestEgyptian;
module.exports.makeRequestAero = makeRequestAero;
module.exports.makeRequestCineFamily = makeRequestCineFamily;
module.exports.allJobs = allJobs;

