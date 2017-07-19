/*
*
* --------------- WARNING!! THIS SCRIPT GETS A BIT ADVANCED (uses the full Google Calendar API in addition to the simple version for Google Apps Script)---------------
*
* STEPS TO GET THIS WORKING:
*
* 1) Click in the menu "Resources" > "Advanced Google services..."
* 2) In the dialog box that pops up, make sure that for "Calendar API" the switch on the right is switched to "on"
* 3) In that same dialog box, click the "Google Developers Console" link
* 4) On the right side under the category "Google Apps APIs", click "Calendar API"
* 5) At the top under "Overview", click "Enable API"
* 6) You can now close this tab and return to the original script
* 7) In the code, change line 28 to be the name of your calendar (remember to keep the quotes)
* 8) Change line 30 to reflect what date the events start on and change "PST" to your timezone (keep the same formatting)
* 9) Change line 32 to be a keyword you want to match or "" to select all the events in the calendar after the date in line 8 (remember this is a case-sensitive match)
* 10) Change line 34 to be "0" or "1" depending on whether you want to search for the keyword in the title (0) or in the description (1) of events
* 11) Change line 36 to be the color to change to (all lower-case). This is defined by the tool tip shown when editing an event (e.g.http://i.imgur.com/hlHCW3x.png)
* 12) Finally, once you're all set with the above steps, click in the menu "Run" > "myFunction" (you may have to authorize the script to modify your calendar the first time)
*
* ------------------------------------------------------------------------------
*/

function myFunction() {

  //---------ONLY EDIT BELOW HERE UNLESS YOU REALLY KNOW WHAT YOU'RE DOING---------
  
  
  var calendar = "Test"; //The name of the calendar you want to modify (WITH quotes)
  
  var startDate = new Date("Jan 10 PST 2016"); //The start of the time range in which the events exist
  
  var keyword = "Blue"; //The keyword to search for in the event title (WITH quotes; IS case-sensitive)
  
  var where = 1;        //Where to search for events (0 = title; 1 = description)
  
  var color = "blue"; //The color to change the events to (WITH the quotes)
  
  
  //---------ONLY EDIT ABOVE HERE UNLESS YOU REALLY KNOW WHAT YOU'RE DOING---------
  
  var calendarId = CalendarApp.getCalendarsByName(calendar)[0].getId();
  
  var optionalArgs = {
    timeMin: startDate.toISOString(),
    showDeleted: false,
    singleEvents: true,
    orderBy: 'startTime'
  };
  
  var service = Calendar.Events;
  var response = Calendar.Events.list(calendarId, optionalArgs);
  var events = response.items;

  for (i = 0; i < events.length; i++) {    
  Logger.log(events[i].summary);
  
    if (where == 0)
      var searchResult = events[i].summary.search(keyword);
    else if (where == 1){
      if (events[i].description == undefined)
        continue;
        
      var searchResult = events[i].description.search(keyword);
    }
  
    if (searchResult > -1){
    
      if (color == "bold blue")
        events[i].colorId = 9;
      else if (color == "blue")
        events[i].colorId = 1;
      else if (color == "turquoise")
        events[i].colorId = 7;
      else if (color == "green")
        events[i].colorId = 2;
      else if (color == "bold green")
        events[i].colorId = 10;
      else if (color == "yellow")
        events[i].colorId = 5;
      else if (color == "orange")
        events[i].colorId = 6;
      else if (color == "red")
        events[i].colorId = 4;
      else if (color == "bold red")
        events[i].colorId = 11;
      else if (color == "purple")
        events[i].colorId = 3;
      else if (color == "gray")
        events[i].colorId = 8;
       
      try{  
        service.update(events[i], calendarId, events[i].id);
      }
      catch(e){
        Logger.log(e);
      }
    }
  }
}
