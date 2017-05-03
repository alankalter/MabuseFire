var nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        type: 'OAuth2',
        user: 'mabuselosangeles@gmail.com',        
        clientId: '466266236965-c7d4k1rbqg6m2qc5r2itmvuh75qqvevb.apps.googleusercontent.com',
        clientSecret: 'vJExiiShYHOZPRJIGy9tPbFH',
        refreshToken: '1/cGGGoQhaFOcd48Dt4BXCFtPo8J-PA6EK3Z8zuOXtmOg',
        accessToken: 'ya29.Gls8BKrjPiC9V5kWBzFMSv2h-E6nfKAn0485crosdVu_qLMsluqJdGL5TEYUCRmE7KUc5yirpNF_zjTVzGML78XSYqRwP1rGHkPQbemHL8vD3B4zUKvVi_3CkxKm',
        expires: 1484314697598
    }
});

function sendMail(){            
            transporter.sendMail({
                from: '',
                to: 'mabuselosangeles@gmail.com',
                subject: 'still testing',
                text: 'log attached!',
                attachments: [{   // filename and content type is derived from path
                    path: './logs/mabuseFire.log'
                }]        
            });
}
module.exports.sendMail = sendMail;            