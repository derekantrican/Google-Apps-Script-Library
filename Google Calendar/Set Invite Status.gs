function myFunction() {
  //---------ONLY EDIT BELOW HERE UNLESS YOU REALLY KNOW WHAT YOU'RE DOING---------

  var startDate = new Date("July 26 PST 2016"); //Required: The start of the time range in which the events exist
  
  var endDate   = new Date("July 30 PST 2016"); //Required: The end of the time range in which the events exist
  
  var calendar  = ""; //Optional: calendar to search on (Leave as "" for all calendars. IS case-sensitive)     
  
  var keyword   = ""; //Optional: keyword to search for in the title of the event (WITH quotes. One phrase at a time & IS case-sensitive. If you don't want to limit to events that match the keyword, leave as "")
  
  var status    = "YES"; //Required: Status to set (Options: "YES", "NO", "MAYBE", "INVITED". IS case-sensitive)
  
  //---------ONLY EDIT ABOVE HERE UNLESS YOU REALLY KNOW WHAT YOU'RE DOING---------
  
  if (calendar == "")
    var calendars = CalendarApp.getAllCalendars();
  else
    var calendars = CalendarApp.getCalendarsByName(calendar);
    
  for (var i = 0; i < calendars.length; i++){
    var events = calendars[i].getEvents(startDate, endDate);
    
    for (var j = 0; j < events.length; j++){
      if (keyword != "" && events[j].getTitle().indexOf(keyword) < 0)
        continue;
        
        Logger.log("Before status for \"" + events[j].getTitle() + "\" (" + calendars[i].getName() + "): " + events[j].getMyStatus());
        
        if (events[j].getMyStatus() == CalendarApp.GuestStatus.OWNER){
          Logger.log("You are already the owner for this event");
          continue;
        }
        else if (events[j].getMyStatus() == null){
          Logger.log("A response cannot be set on this event");
          continue;
        }
        
        if (status == "YES")
          events[j].setMyStatus(CalendarApp.GuestStatus.YES);
        else if (status == "NO")
          events[j].setMyStatus(CalendarApp.GuestStatus.NO);
        else if (status == "MAYBE")
          events[j].setMyStatus(CalendarApp.GuestStatus.MAYBE);
        else if (status == "INVITED")
          events[j].setMyStatus(CalendarApp.GuestStatus.INVITED);
        
        Logger.log("After status for \"" + events[j].getTitle() + "\" (" + calendars[i].getName() + "): " + events[j].getMyStatus());
    }
  }
}
