function myFunction() {

//---------------------------EDIT THIS ONLY-------------------------

//Name of the calendars to delete events from
var calendarNames = ["calendar1",
                     "calendar2",
                     "calendar3"];

var startTime = new Date("Feb 11 PST 2017"); //The start of the time range in which the events exist

var endTime = new Date("Feb 19 PST 2017"); //The end of the time range in which the events exist

var keyword = ""; //Keyword to search for in the event's title (Leave as "" to not use keyword search)

     //To see what happened, click in the menu "View" > "Logs"
//------------------------------------------------------------------

  for (var i = 0; i < calendarNames.length; i++){
    var calendar = CalendarApp.getCalendarsByName(calendarNames[i])[0]; 
    
    var events = calendar.getEvents(startTime, endTime);
    
    for (var j = 0; j < events.length; j++){
      //Get the info from the event on the old calendar
      var title = events[j].getTitle();
        
      if (keyword != "" && title.indexOf(keyword) < 0)
        continue;
    
      //Delete the event from the calendar
      events[j].deleteEvent();
      Logger.log("Deleted \"" + title + "\" from " + calendar.getName());
    }
  }
}
