var moment = require('moment');


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

function timeNow() {
  var d = new Date(),
      h = (d.getHours()<10?'0':'') + d.getHours(),
      m = (d.getMinutes()<10?'0':'') + d.getMinutes();
      
      return h + ':' + m;
}

module.exports = {
  getDateWithDeterminedYear : getDateWithDeterminedYear,
  timeNow : timeNow
}