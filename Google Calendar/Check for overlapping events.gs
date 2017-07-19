function myFunction() {
  //---------ONLY EDIT BELOW HERE UNLESS YOU REALLY KNOW WHAT YOU'RE DOING---------
  var calendars = "derekantrican@gmail.com,Work";              //Calendar names. Comma-separated (e.g. "Calendar1,Calendar2,This is also a calendar")  
  //---------ONLY EDIT ABOVE HERE UNLESS YOU REALLY KNOW WHAT YOU'RE DOING---------
  
  calendars = calendars.split(",");
  var finalArray = new Array(calendars.length);
  var now = new Date();
  var oneMonth =  new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
  
  for (var i = 0; i < calendars.length; i++){
    var calendar = CalendarApp.getCalendarsByName(calendars[i].trim())[0];
    var events = calendar.getEvents(now, oneMonth);
    var eventArray = new Array(events.length);
    
    for (var j = 0; j < events.length; j++){
      //Todo: need support for All-day events
      var currentEventArray = [events[j].getTitle(), events[j].getStartTime(), events[j].getEndTime(), events[j].getId()];
      eventArray[j] = currentEventArray;
    }
    
    finalArray[i] = eventArray;
  }
  
  processArray(finalArray);
}

function processArray(array){
  //Logger.log(array);
  var results = [];
  
  for (var i = 0; i < array.length; i++){
    var eventsForThisCalendar = array[i];
    for (var j = 0; j < eventsForThisCalendar.length; j++){
      var detailsForCurrentEvent = eventsForThisCalendar[j];

      var currentResult = checkAgainstAllEvents(detailsForCurrentEvent, array);
      if (currentResult == "pass")
        continue;
      else
        results.push(currentResult);
    }
  }
  
  Logger.log(results);
  
  if (results.length == 0)
    return;
  
  var body = "Here are some conflicting events that were found on your calendar:\n";
  for (var i = 0; i < results.length; i++)
    body += "\n" + results[i];
  
  //GmailApp.sendEmail("derekantrican@gmail.com", "Conflicting Events", body);
}

function checkAgainstAllEvents(myEventDetails, fullArray){
  var myStartTime = new Date(myEventDetails[1]);
  var myEndTime = new Date(myEventDetails[2]);
  var found = false;

  for (var i = 0; i < fullArray.length; i++){
    var eventsForThisCalendar = fullArray[i];
    for (var j = 0; j < eventsForThisCalendar.length; j++){
      var detailsForCurrentEvent = eventsForThisCalendar[j];
      var startTimeToCheck = detailsForCurrentEvent[1];
      var endTimeToCheck = detailsForCurrentEvent[2];
      
      if (!found && myEventDetails[3] != detailsForCurrentEvent[3]) //This way we don't check against events that have already been run through this function (which would result in duplicate "conflict results")
        continue;
      
      if (myEventDetails[3] == detailsForCurrentEvent[3]){ //This is the same event (the ids are the same)
        found = true;
        continue;
      }
      else if (myEndTime <= startTimeToCheck) //No conflict. myEvent is entirely before eventToCheck. In fact, we can now jump to the next calendar (eventToCheck will always be after myEvent for the rest of this calendar)
        break;
      else if (myStartTime >= endTimeToCheck) //No conflict. myEvent is entirely after eventToCheck
        continue;
      else{                                //There is a conflict (either entirely overlapping or partially overlapping)
        Logger.log(myEventDetails);
        return '"' + myEventDetails[0] + "\" conflicts with \"" + detailsForCurrentEvent[0] + "\" on " + myStartTime.toDateString();
      }
    }
  }
  
  return "pass"; //There are no conflicts with myEvent
}
