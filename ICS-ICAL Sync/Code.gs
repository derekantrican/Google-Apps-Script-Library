/* --------------- HOW TO INSTALL ---------------
*
* 1) Click in the menu "File" > "Make a copy..." and make a copy to your Google Drive
* 2) Changes lines 10-18 to be the settings that you want to use
* 3) Click in the menu "Run" > "Run function" > "Install" and authorize the program
*
*/

// --------------- SETTINGS ---------------
var sourceCalendarURL = ""; //The ics/ical url that you want to get events from
var targetCalendarName = ""; //The name of the Google Calendar you want to add events to
var howFrequent = 15; //What interval (minutes) to run this script on to check for new events
var addEventsToCalendar = true; //If you turn this to "false", you can check the log (View > Logs) to make sure your events are being read correctly before turning this on
var addAlerts = true; //Whether to add the ics/ical alerts as notifications on the Google Calendar events
var descriptionAsTitles = false; //Whether to use the ics/ical descriptions as titles (true) or to use the normal titles as titles (false)

var emailWhenAdded = false; //Will email you when an event is added to your calendar
var email = ""; //OPTIONAL: If "emailWhenAdded" is set to true, you will need to provide your email
// ----------------------------------------

/* --------------- MISCELLANEOUS ----------
*
* This program was created by Derek Antrican
*
* The code for this program is kept updated here: https://github.com/derekantrican/Google-Apps-Script-Library/tree/master/ICS-ICAL%20Sync
* 
* If you would like to donate and help Derek keep making awesome programs,
* you can do that here: https://bulkeditcalendarevents.wordpress.com/donate/
* 
* If you would like to see other programs Derek has made, you can check out
* his website: derekantrican.com or his github: https://github.com/derekantrican
* 
*/


//---------------- DO NOT EDIT BELOW HERE UNLESS YOU REALLY KNOW WHAT YOU'RE DOING --------------------
function Install(){
  ScriptApp.newTrigger(myFunction).timeBased().everyMinutes(howFrequent).create();
}

function main() {  
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
  
  if (emailWhenAdded && email == ""){
    Logger.clear();
    Logger.log("[ERROR] \"emailWhenAdded\" is set to true, but no email is defined");
    return;
  }
  //----------------------------------------------------------------
  
  //------------------------ Parse events --------------------------
  //https://en.wikipedia.org/wiki/ICalendar#Technical_specifications
  //https://tools.ietf.org/html/rfc5545
  //https://www.kanzaki.com/docs/ical
  
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
      if (addAlerts){
        if (response[i].includes("TRIGGER"))
          currentEvent.reminderTimes[currentEvent.reminderTimes.length++] = ParseNotificationTime(response[i].split("TRIGGER:")[1]);
      }
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
    
    for (var j = 0; j < events[i].reminderTimes.length; j++)
      Logger.log("Reminder: " + events[i].reminderTimes[j] + " seconds before");
    
    Logger.log("");
  }
  //----------------------------------------------------------------
  
  //------------------------ Add events to calendar ----------------
  if (addEventsToCalendar){
    for (var i = 0; i < events.length; i++){
      if (!EventExists(targetCalendar, events[i])){
        var resultEvent = targetCalendar.createEvent(events[i].title, events[i].startTime, events[i].endTime, {location : events[i].location, description : events[i].description + "\n\n" + events[i].id});
        
        for (var j = 0; j < events[i].reminderTimes.length; j++)
          resultEvent.addPopupReminder(events[i].reminderTimes[j] / 60);
          
        if (emailWhenAdded)
          GmailApp.sendEmail(email, "New Event Added", "New event added to calendar \"" + targetCalendarName + "\" at " + events[i].startTime);
      }
    }
  }
  //----------------------------------------------------------------
}

function ParseNotificationTime(notificationString){
  //https://www.kanzaki.com/docs/ical/duration-t.html
  var reminderTime = 0;
  
  //We will assume all notifications are BEFORE the event
  if (notificationString[0] == "+" || notificationString[0] == "-")
    notificationString = notificationString.substr(1);
    
  notificationString = notificationString.substr(1); //Remove "P" character
  
  var secondMatch = RegExp("\\d+S", "g").exec(notificationString);
  var minuteMatch = RegExp("\\d+M", "g").exec(notificationString);
  var hourMatch = RegExp("\\d+H", "g").exec(notificationString);
  var dayMatch = RegExp("\\d+D", "g").exec(notificationString);
  var weekMatch = RegExp("\\d+W", "g").exec(notificationString);
  
  if (weekMatch != null){
    reminderTime += parseInt(weekMatch[0].slice(0, -1)) & 7 * 24 * 60 * 60; //Remove the "W" off the end
    
    return reminderTime; //Return the notification time in seconds
  }
  else{
    if (secondMatch != null)
      reminderTime += parseInt(secondMatch[0].slice(0, -1)); //Remove the "S" off the end
      
    if (minuteMatch != null)
      reminderTime += parseInt(minuteMatch[0].slice(0, -1)) * 60; //Remove the "M" off the end
      
    if (hourMatch != null)
      reminderTime += parseInt(hourMatch[0].slice(0, -1)) * 60 * 60; //Remove the "H" off the end
      
    if (dayMatch != null)
      reminderTime += parseInt(dayMatch[0].slice(0, -1)) * 24 * 60 * 60; //Remove the "D" off the end
      
    return reminderTime; //Return the notification time in seconds
  }
}

function EventExists(calendar, event){
  var events = calendar.getEvents(event.startTime, event.endTime, {search : event.id});
  
  return events.length > 0;
}
