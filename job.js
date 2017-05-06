var mail = require('./mail.js');
var scrapes = require('./services');
var fs = require('fs');
var helpers = require("./helpers");

var allJobs =
[
    "Lacma",
    "Egyptian",
    "Aero",
    "CineFamily",
    "NewBeverly",
    "RooftopCinemaClub",
    "UCLAFilmandTV",
    "SkirballCenter",
    "EatSeeHear",
    "Cinespia",
    "LAFilmForum",
    "StreetFoodCinema",
    "SilverLakePictureShow",
    "EchoParkFilmCenter"
];

var runBatch = function (cb){
    var tasks = allJobs;
    console.log('clearing log');
    var interId = setInterval(function(){ console.log("working " + helpers.timeNow()); }, 30000);
    
    fs.writeFile('./logs/mabuseFire.log', '', function(){console.log('done')});

    console.log('starting batch job ' + new Date());
    var writeDB = true;

    var callback = function(){
            
            tasks.shift();
            if(tasks.length <= 0){
                console.log('All tasks have completed. ');
                finish();
                return;
            }

        scrapes[tasks[0]](writeDB, callback);
    }    

    var result = scrapes[tasks[0]](writeDB, callback);
    
    function finish (){
        mail.sendMail("Batch");
        console.log("finished batch job " + new Date());
        clearInterval(interId);        
        cb();  
        return result;      
    }

};

var runJob = function (id, cb){
    console.log('clearing log');
    var jobName = allJobs[id];
    var interId = setInterval(function(){ console.log("working " + helpers.timeNow()); }, 30000);

    fs.writeFile('./logs/mabuseFire.log', '', function(){console.log('done log clear')});
    
    console.log('starting job ' + new Date());
    var writeDB = true;    

    var callback = function(){
                finish();
                return;
    }    

    var result = scrapes[jobName](writeDB, callback);
    
    function finish (){
        mail.sendMail(jobName);
        console.log("finished job " + new Date());
        clearInterval(interId);
        cb();        
    }

};

module.exports.runBatch = runBatch;
module.exports.allJobs = allJobs;
module.exports.runJob = runJob;