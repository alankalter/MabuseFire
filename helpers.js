
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

module.exports.getDateWithDeterminedYear = getDateWithDeterminedYear;