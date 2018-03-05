function main() {
  //-------------------------------------- USER-DEFINED VARIABLES -----------------------------------------
  var sourceCalendarURL = ""; //The ics/ical url that you want to get events from
  var targetCalendarName = ""; //The name of the Google Calendar you want to add events to
  var descriptionAsTitles = true; //Whether to use the ics/ical descriptions as titles (true) or to use the normal titles as titles (false)
  var addAlerts = false; //Whether to add the ics/ical alerts as notifications on the Google Calendar events
  var addEventsToCalendar = true; //If you turn this to "false", you can check the log (View > Logs) to make sure your events are being read correctly before turning this on
  //-------------------------------------------------------------------------------------------------------
  
  //Get URL items
  var response = UrlFetchApp.fetch(sourceCalendarURL);
  response = response.getContentText().split("\r\n");
  
  //Get target calendar information
  var targetCalendar = CalendarApp.getCalendarsByName(targetCalendarName)[0];
  
  //------------------------ Error checking ------------------------
  if(response[0] == "That calendar does not exist."){
    Logger.clear();
    Logger.log("[ERROR] Incorrect ics/ical URL");
    return;
  }
  
  if(targetCalendar == null){
    Logger.clear();
    Logger.log("[ERROR] Could not find calendar of name \"" + targetCalendarName + "\"");
    return;
  }
  
  if (response[1].split("VERSION:")[1] != "2.0"){
    Logger.clear();
    Logger.log("[ERROR] Wrong ics/ical version. Currently only version 2.0 is supported");
    return;
  }
  //----------------------------------------------------------------
  
  //------------------------ Parse events --------------------------
  //https://en.wikipedia.org/wiki/ICalendar#Technical_specifications
  //https://tools.ietf.org/html/rfc5545
  
  var parsingEvent = false;
  var parsingNotification = false;
  var currentEvent;
  var events = [];
  for (var i = 0; i < response.length; i++){  
    if (response[i] == "BEGIN:VEVENT"){
      parsingEvent = true;
      currentEvent = new Event();
    }
    else if (response[i] == "END:VEVENT"){
      parsingEvent = false;
      events[events.length] = currentEvent;
    }
    else if (response[i] == "BEGIN:VALARM")
      parsingNotification = true;
    else if (response[i] == "END:VALARM")
      parsingNotification = false;
    else if (parsingNotification){
      //Not supported yet
    }
    else if (parsingEvent){
      if (response[i].includes("SUMMARY") && !descriptionAsTitles)
        currentEvent.title = response[i].split("SUMMARY:")[1];
        
      if (response[i].includes("DESCRIPTION") && descriptionAsTitles)
        currentEvent.title = response[i].split("DESCRIPTION:")[1];
      else if (response[i].includes("DESCRIPTION"))
        currentEvent.description = response[i].split("DESCRIPTION:")[1];   
    
      if (response[i].includes("DTSTART"))
        currentEvent.startTime = Moment.moment(response[i].split("DTSTART:")[1], "YYYYMMDDTHHmmssZ").toDate();
        
      if (response[i].includes("DTEND"))
        currentEvent.endTime = Moment.moment(response[i].split("DTEND:")[1], "YYYYMMDDTHHmmssZ").toDate();
        
      if (response[i].includes("LOCATION"))
        currentEvent.location = response[i].split("LOCATION:")[1];
        
      if (response[i].includes("UID"))
        currentEvent.id = response[i].split("UID:")[1];
    }
  }
  //----------------------------------------------------------------
  
  //------------------------ Check results -------------------------
  Logger.log("# of events: " + events.length);
  for (var i = 0; i < events.length; i++){
    Logger.log("Title: " + events[i].title);
    Logger.log("Id: " + events[i].id);
    Logger.log("Description: " + events[i].description);
    Logger.log("Start: " + events[i].startTime);
    Logger.log("End: " + events[i].endTime);
    
    Logger.log("");
  }
  //----------------------------------------------------------------
  
  //------------------------ Add events to calendar ----------------
  if (addEventsToCalendar){
    for (var i = 0; i < events.length; i++){
      if (!EventExists(targetCalendar, events[i]))    
        targetCalendar.createEvent(events[i].title, events[i].startTime, events[i].endTime, {location : events[i].location, description : events[i].description + "\n\n" + events[i].id});
    }
  }
  //----------------------------------------------------------------
}

function EventExists(calendar, event){
  var events = calendar.getEvents(event.startTime, event.endTime, {search : event.id});
  
  return events.length > 0;
}
