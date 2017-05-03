var admin = require("firebase-admin");
var serviceAccount = require("mabuse-57164-firebase-adminsdk-gpl49-9ecec6dc84.json");

admin.initializeApp({
credential: admin.credential.cert(serviceAccount),
databaseURL: "https://mabuse-57164.firebaseio.com"
});


function writeToDB (resultArr, theaterName){

    try {       

        var db = admin.database();
        var ref = db.ref("Theaters");

        var usersRef = ref.child(theaterName);
        usersRef.set(resultArr);    
    }
    catch (err){
        logger.error('firebase write error');
        logger.error(err);
    }

}

module.exports.writeToDB = writeToDB;