var mail = require('./mail.js');
var scrapes = require('./services');
var fs = require('fs');


var runBatch = function (cb){
    console.log('clearing log');
    
    fs.writeFile('./logs/mabuseFire.log', '', function(){console.log('done')});

    console.log('starting batch ' + new Date());
    var writeDB = true;

    var tasks =
    [
    "makeRequestLacma",
    "makeRequestEgyptian",
    "makeRequestAero",
    "makeRequestCineFamily",
    "makeRequestNewBeverly"    
    ];

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
        mail.sendMail();
        console.log("finished job" + new Date());
        cb();  
        return result;      
    }

};

var runJob = function (id, cb){
    console.log('clearing log');
    fs.writeFile('./logs/mabuseFire.log', '', function(){console.log('done')});
    
    console.log('starting batch ' + new Date());
    var writeDB = true;    

    var callback = function(){
                finish();
                return;
    }    

    var result = scrapes[allJobs[id]](writeDB, callback);
    
    function finish (){
        mail.sendMail();
        console.log("finished job" + new Date());
        cb();        
    }

};


var allJobs =
[
"makeRequestLacma",
"makeRequestEgyptian",
"makeRequestAero",
"makeRequestCineFamily",
"makeRequestNewBeverly"
];


module.exports.runBatch = runBatch;
module.exports.allJobs = allJobs;
module.exports.runJob = runJob;