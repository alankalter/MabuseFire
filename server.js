var express = require('express');
var scrapes = require('./services');
var app     = express();
var mail = require('./mail.js');
var job = require('./job');
var cron = require('node-cron');
var fs = require('fs');
app.set('view engine', 'ejs');

 

cron.schedule('0 0 13 * * *', function () {job.runBatch(function(){console.log("cron ran batch job");})});


app.get('/', function (req, res){
    
    res.render('index', {jobs: job.allJobs});
})

app.get('/singlejob/:jobId', function (req, res) {
    
    job.runJob(req.params["jobId"], function(){res.send("job finished");})
})

app.get('/batch', function (req, res) {

    job.runBatch(function(){res.send("jobs finished");});
})

app.get('/log', function (req, res){

    res.sendFile('./logs/mabuseFire.log', { root : __dirname});
})

app.get('/clearlog', function(req, res){

    fs.writeFile('./logs/mabuseFire.log', 'emptied', function(){console.log('done clearing log')});
    res.send("clearing log");
})

var server = app.listen(process.env.PORT || '8081');
server.timeout = 500000;

console.log('Magic happens on port 8081');

exports = module.exports = app;