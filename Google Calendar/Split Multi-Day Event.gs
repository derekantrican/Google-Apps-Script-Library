function myFunction() {
  //Currently events greater than 24-hours are shown in the "all-day" section. This program breaks up those events so that they exist in the main calendar section
  
  var now = new Date();
  var oneMonth =  new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
  var calendars = ["derekantrican@gmail.com"];
  
  for (var i = 0; i < calendars.length; i++){
    var calendar = CalendarApp.getCalendarsByName(calendars[i])[0];
    
    var events = calendar.getEvents(now, oneMonth);
    
    for (var j = 0; j < events.length; j++){
      var duration = (events[j].getEndTime() - events[j].getStartTime()) / (1000 * 60 * 60);
      Logger.log(events[j].getTitle());
      Logger.log("Duration: " + duration + " hours");
      
      if (duration >= 24){
        var finalStart = events[j].getStartTime();
        var finalEnd = events[j].getEndTime();

        for (var k = 0; k <= Math.floor(duration/24); k++){
          var curStart;
          var curEnd;
          var newEvent;
          
          if (k == 0){ //First iteration
            curEnd = new Date(finalStart.getYear(), finalStart.getMonth(), finalStart.getDate(), 23, 59);
            newEvent = calendar.createEvent(events[j].getTitle(), finalStart, curEnd);
          }
          else if (k == Math.floor(duration/24)){ //Last iteration
            curStart = new Date(finalEnd.getYear(), finalEnd.getMonth(), finalEnd.getDate(), 0, 0);
            newEvent = calendar.createEvent(events[j].getTitle(), curStart, finalEnd);
            newEvent.removeAllReminders();
          }
          else{
            curStart = new Date(finalStart.getYear(), finalStart.getMonth(), finalStart.getDate() + k, 0, 0);
            curEnd = new Date(finalStart.getYear(), finalStart.getMonth(), finalStart.getDate() + k, 23, 59);
            newEvent = calendar.createEvent(events[j].getTitle(), curStart, curEnd);
            newEvent.removeAllReminders();
          }
          
          newEvent.setLocation(events[j].getLocation());
          newEvent.setDescription(events[j].getDescription());
        }
        
        GmailApp.sendEmail("derekantrican@gmail.com", "Events were adjusted", "The event " + events[j].getTitle() + " was just adjusted on your calendar");
        events[j].deleteEvent();
      }        
    }
  }
}
