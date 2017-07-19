function myFunction() {

//---------------------------EDIT THIS ONLY-------------------------

var oldCal = "work"; //Name of the calendar to copy events from

var newCal = "personal"; //Name of the calendar to copy events to

var startTime = new Date("Aug 25 PST 2015"); //The start of the time range in which the events exist

var endTime = new Date("Aug 31 PST 2015"); //The end of the time range in which the events exist

var deleteEvent = "N"; //Should the old event be deleted? "Y" or "N"

var keyword = "test"; //Keyword to search for in the event's title (Leave as "" to not use keyword search)

     //To see what happened, click in the menu "View" > "Logs"
//------------------------------------------------------------------

var calendar1=CalendarApp.getCalendarsByName(oldCal)[0]; 
var calendar2=CalendarApp.getCalendarsByName(newCal)[0];

var events = calendar1.getEvents(startTime, endTime);

  for (var i = 0; i < events.length; i++){
    //Get the info from the event on the old calendar
    var title = events[i].getTitle();
    
    if (keyword != "" && title.indexOf(keyword) < 0)
      continue;
    
    var desc = events[i].getDescription();
    var loc = events[i].getLocation();
    var start = events[i].getStartTime();
    var end = events[i].getEndTime();
    Logger.log(start);
    //Create the new event on the new calendar
    var newEvent = calendar2.createEvent(title, start, end, {description: desc, location: loc});
    Logger.log("Moved \"" + title + "\" from " + calendar1.getName() + " to " + calendar2.getName());
    
    if (events[i].isAllDayEvent()){
      start = new Date(start.getTime() + (24 * 60 * 60 * 1000)); //Add a day to the date because of this error: https://goo.gl/gYF7dm
      newEvent.setAllDayDate(start);
    }
    
    //Delete the old event from the old calendar
    if (deleteEvent == "Y")
      events[i].deleteEvent();
  }

}
