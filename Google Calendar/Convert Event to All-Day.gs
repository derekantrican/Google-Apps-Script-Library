function myFunction() {
  //---------ONLY EDIT BELOW HERE UNLESS YOU REALLY KNOW WHAT YOU'RE DOING--------- 
  
  var calendar = "Test";                       //The name of the calendar you want to modify (WITH quotes)
  
  var startDate = new Date("Jan 10 PST 2017"); //The start of the time range in which the events exist
  
  var endDate = new Date ("Dec 31 PST 2017");  //The end of the time range in which the events exist
  
  var keyword = "";                            //The keyword to search for in the event title (WITH quotes; IS case-sensitive)
  
  //---------ONLY EDIT ABOVE HERE UNLESS YOU REALLY KNOW WHAT YOU'RE DOING---------
  
  var calendar = CalendarApp.getCalendarsByName(calendar)[0];
  var events = calendar.getEvents(startDate, endDate);
  
  Logger.log("Found " + events.length + " events");
  
  for (var i = 0; i < events.length; i++){
    if (keyword != "" && keyword != null && events[i].getTitle().indexOf(keyword) > -1)
      events[i].setAllDayDate(events[i].getStartTime());
    else if (keyword == ""){
      events[i].setAllDayDate(events[i].getStartTime());
    }
  }
}
