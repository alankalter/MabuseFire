var mail = require('./mail.js');
var scrapes = require('./services');

var runBatch = function ()
{
    console.log('starting batch ' + new Date());
    var writeDB = true;

    var tasks =
    [
    "makeRequestLacma",
    "makeRequestEgyptian",
    "makeRequestAero",
    "makeRequestCineFamily"
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
    }
};

module.exports.runBatch = runBatch;