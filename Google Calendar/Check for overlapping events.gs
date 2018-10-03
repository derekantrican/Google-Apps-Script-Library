//---------ONLY EDIT BELOW HERE UNLESS YOU REALLY KNOW WHAT YOU'RE DOING---------
var calendars = "derekantrican@gmail.com,Work";               //Calendar names. Comma-separated (eg "Calendar1,Calendar2,This is also a calendar")
var filterKeywords = "";                                //Filter keywords blacklist (ie an event won't be "overlapping" if it contains one of these keywords). Comma-separated. Case-insensitive
//---------ONLY EDIT ABOVE HERE UNLESS YOU REALLY KNOW WHAT YOU'RE DOING---------

function myFunction() {
  calendars = calendars.split(",");
  calendars = cleanArray(calendars); //Remove empty entries
  
  var finalArray = [];
  var now = new Date();
  var oneMonth =  new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
  
  for (var i = 0; i < calendars.length; i++){
    var calendar = CalendarApp.getCalendarsByName(calendars[i].trim())[0];
    var events = calendar.getEvents(now, oneMonth);
    
    for (var j = 0; j < events.length; j++){
      //Todo: need support for All-day events
      var currentEventArray = [events[j].getTitle(), events[j].getStartTime(), events[j].getEndTime(), events[j].getId()];
      finalArray.push(currentEventArray);
    }
  }
  
  processArray(finalArray);
}

function processArray(array){  
  var results = [];
  
  for (var i = 0; i < array.length; i++){
    var detailsForCurrentEvent = array[i];
    
    var currentResult = checkAgainstEvents(detailsForCurrentEvent, array.slice(i));
    if (currentResult == "pass")
      continue;
    else
      results.push(currentResult);
  }
    
  if (results.length == 0)
    return;
  
  var body = "Here are some conflicting events that were found on your calendar:\n";
  for (var i = 0; i < results.length; i++)
    body += "\n" + results[i];
  
  MailApp.sendEmail("derekantrican@gmail.com", "Conflicting Events", body);
}

function checkAgainstEvents(myEventDetails, fullArray){
  var myTitle = myEventDetails[0];
  var myStartTime = new Date(myEventDetails[1]);
  var myEndTime = new Date(myEventDetails[2]);
  var found = false;

  for (var i = 0; i < fullArray.length; i++){
    var detailsForCurrentEvent = fullArray[i];
    var startTimeToCheck = detailsForCurrentEvent[1];
    var endTimeToCheck = detailsForCurrentEvent[2];
    var eventTitleToCheck = detailsForCurrentEvent[0];
    
    if (myEventDetails[3] == detailsForCurrentEvent[3]){ //This is the same event (the ids are the same)
      found = true;
      continue;
    }
    else if (myEndTime <= startTimeToCheck) //No conflict. myEvent is entirely before eventToCheck
      continue;
    else if (myStartTime >= endTimeToCheck) //No conflict. myEvent is entirely after eventToCheck
      continue;
    else if (keywordMatch(eventTitleToCheck) || keywordMatch(myTitle)) //Either event contains a filter keyword
      continue;
    else                                //There is a conflict (either entirely overlapping or partially overlapping)
      return '"' + myEventDetails[0] + "\" conflicts with \"" + detailsForCurrentEvent[0] + "\" on " + myStartTime.toDateString();
  }
  
  return "pass"; //There are no conflicts with myEvent
}

function keywordMatch(inputString){
  var keywordArray = filterKeywords.split(",");
  keywordArray = cleanArray(keywordArray); //Remove empty entries
  
  for (var i = 0; i < keywordArray.length; i++){
    if (inputString.toUpperCase().includes(keywordArray[i].toUpperCase()))
      return true;
  }
  
  return false;
}

String.prototype.includes = function(phrase){ 
  return this.indexOf(phrase) > -1;
}

function cleanArray(actual) {
  //Credit: https://stackoverflow.com/a/281335
  var newArray = new Array();
  for (var i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}
