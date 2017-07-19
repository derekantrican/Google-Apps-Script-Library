/*
TO DO:

- Post-meeting functionality

*/

function anyDoMoment() {
 
 var now = new Date();
 var todaySimple = Utilities.formatDate(now, Session.getScriptTimeZone(), "MM-dd");
 var thisYear = Utilities.formatDate(now, Session.getScriptTimeZone(), "YYYY");
 var tomorrow = new Date(Utilities.formatDate(now, Session.getScriptTimeZone(), "MMM") + " " + todaySimple.split("-")[1] + " 23:00 GMT -5:00 " + thisYear);
 var files = DriveApp.getFilesByName("Google Tasks \"Moment\"");
 var exists = false;

 if (files.hasNext()){
   exists = true;
   var file = files.next();
   var date = file.getLastUpdated();
   var dateSimple = Utilities.formatDate(date, Session.getScriptTimeZone(), "MM-dd");
   
   if (dateSimple != todaySimple){
     file.setTrashed(true);
     exists = false;
   }
   
   var url = file.getUrl();
   var form = FormApp.openByUrl(url);
 }
 else{
   
   moveToDateList(); //Make sure the tasks that were set for "tomorrow" yesterday are moved up to today before executing this function
   
   var defaultList = Tasks.Tasks.list("@default");
   var items = defaultList.items; //Google tasks
   
   var triggers = ScriptApp.getProjectTriggers(); 
   for (var i = 0; i < triggers.length; i++) { //Delete any existing triggers
     try{
     if (ScriptApp.getProjectTriggers()[i].getHandlerFunction() == "anyDoMoment")
       ScriptApp.deleteTrigger(triggers[i]);
     }
     catch(e){
       Logger.log("ERROR: " + e);
       Logger.log("TRIGGER: " + ScriptApp.getProjectTriggers()[i]);
     }
   }

   if (items.length <= 0){
     ScriptApp.newTrigger("anyDoMoment").timeBased().at(tomorrow).create(); //Trigger itself again tomorrow
     return;
   }
   else if (items.length == 1 && items[0].title == ""){
     ScriptApp.newTrigger("anyDoMoment").timeBased().at(tomorrow).create(); //Trigger itself again tomorrow
     return;
   }
   
   var form = FormApp.create('Google Tasks \"Moment\"');
   form.setDescription("When do you expect to complete the tasks below?");
   
   for (var i = 0; i < items.length; i++){ //Create a multiple choice for each google task
     var when = form.addMultipleChoiceItem();
     when.setRequired(true);
     when.setTitle(items[i].title)
         .setChoices([
             when.createChoice('Today'),
             when.createChoice('Tomorrow'),
             when.createChoice('Someday')
         ]);
   }
  
   var url = form.getPublishedUrl();
   url = shortenUrl(url);
   GmailApp.sendEmail("derekantrican@gmail.com", "Any.Do Moment", "Fill out when you plan to complete today's tasks: " + url);
   ScriptApp.newTrigger("anyDoMoment").timeBased().everyMinutes(1).create(); //Trigger itself every minute until the script runs through and deletes all its triggers
 }
 
 if (exists){
  
  var title = "Default List";
  var allLists = Tasks.Tasklists.list().getItems();
  for (var n in allLists) {
    if (title == allLists[n].getTitle())
      var defaultID = allLists[n].getId();
  }
  
  title = "Tomorrow";
  for (var n in allLists) {
    if (title == allLists[n].getTitle())
      var tomorrowID = allLists[n].getId();
  }
  
  if (typeof tomorrowID == 'undefined'){
    var tomorrowList = Tasks.newTaskList().setTitle("Tomorrow");
    var tomorrowInsert = Tasks.Tasklists.insert(tomorrowList);
    var tomorrowID = tomorrowInsert.getId();
  }
  
  title = "Someday";
  for (var n in allLists) {
    if (title == allLists[n].getTitle())
      var somedayID = allLists[n].getId();
  }
  
  if (typeof somedayID == 'undefined'){
    var somedayList = Tasks.newTaskList().setTitle("Someday");
    var somedayInsert = Tasks.Tasklists.insert(somedayList);
    var somedayID = somedayInsert.getId();
  }
  
   var formResponses = form.getResponses();
   
   if (formResponses.length > 0){
   
      for (var i = 0; i < formResponses.length; i++) {
       var formResponse = formResponses[i];
       var itemResponses = formResponse.getItemResponses();
       for (var j = 0; j < itemResponses.length; j++) {
         var itemResponse = itemResponses[j];

          var newtask = Tasks.newTask().setTitle(itemResponse.getItem().getTitle());

          if (itemResponse.getResponse() == "Tomorrow")
            var ID = tomorrowID;
          else if (itemResponse.getResponse() == "Someday")
            var ID = somedayID;
          else
            continue;
 
          var inserted = Tasks.Tasks.insert(newtask, ID);
          
          var defaultList = Tasks.Tasks.list("@default");
          var items = defaultList.items;
          Logger.log(itemResponse.getItem().getTitle());

          for (var n = 0; n < items.length; n++){
            Logger.log(items[n].title);
            if (items[n].title == itemResponse.getItem().getTitle()){
              var toDeleteID = items[n].getId();
              break;
            }
          }
          try{
            Tasks.Tasks.remove(defaultID, toDeleteID); //Delete the task from the original list
          }
          catch(e){
            GmailApp.sendEmail("derekantrican@gmail.com", "ERROR in Any.Do", "ERROR: " + e);
          }
       }
     }
     
     var triggers = ScriptApp.getProjectTriggers(); 
     for (var i = 0; i < triggers.length; i++) { //Delete any existing triggers
       if (ScriptApp.getProjectTriggers()[i].getHandlerFunction() == "anyDoMoment")
         ScriptApp.deleteTrigger(triggers[i]);
     }
     ScriptApp.newTrigger("anyDoMoment").timeBased().at(tomorrow).create(); //Trigger itself again tomorrow
     DriveApp.getFilesByName("Google Tasks \"Moment\"").next().setTrashed(true); //Delete the form after getting the responses
   }
   else
     Logger.log("No responses");
 }
}

function clearCompleted(){
  //Clear completed tasks

  //var defaultList = Tasks.Tasks.list("@default");
  //var items = defaultList.items; //Google tasks
  var now = new Date();
  var today = Utilities.formatDate(now, Session.getScriptTimeZone(), "MM-dd");
  today = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd");
  
  var allLists = Tasks.Tasklists.list().getItems();
  

  for (var n = 0; n < allLists.length; n++){
    var id = allLists[n].getId();
    Logger.log(id);
    var items = Tasks.Tasks.list(id).items;
    Logger.log(allLists[n].getTitle());
    
    if (typeof items == 'undefined')
      continue;
    
    for (var i = 0; i < items.length; i++){
      Logger.log(items[i].title);

      if (typeof items[i].completed != 'undefined'){
        Logger.log("!!!" + items[i].title + '  is marked as completed');
        var toDeleteID = items[i].getId();
        gamifyAddToFavor(1);
        
        Logger.log("This is due at : " + items[i].due);
        
        if (typeof items[i].due != 'undefined' && items[i].due.split('T')[0] == today)
          gamifyAddToFavor(24);
        
        Tasks.Tasks.remove(id, toDeleteID);
      }
    }
  }
}

function moveToDateList(){
  Logger.clear();
  //Format today and tomorrow date like this: YYYY-MM-DDT23:60:00.00-05:00
  var now = new Date();
  var today = Utilities.formatDate(now, Session.getScriptTimeZone(), "MM-dd");
  var thisYear = Utilities.formatDate(now, Session.getScriptTimeZone(), "YYYY");
  var tomorrow = new Date(Utilities.formatDate(now, Session.getScriptTimeZone(), "MMM") + " " + today.split("-")[1] + " 24:00 GMT -5:00 " + thisYear);
  tomorrow = Utilities.formatDate(tomorrow, Session.getScriptTimeZone(), "yyyy-MM-dd");
  today = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd");
  Logger.log(today);
  Logger.log(tomorrow);
  
  var title = "Default List";
  var allLists = Tasks.Tasklists.list().getItems();
  for (var n in allLists) {
    if (title == allLists[n].getTitle())
      var defaultID = allLists[n].getId();
  }
  
  title = "Tomorrow";
  for (var n in allLists) {
    if (title == allLists[n].getTitle())
      var tomorrowID = allLists[n].getId();
  }
  
  title = "Someday";
  for (var n in allLists) {
    if (title == allLists[n].getTitle())
      var somedayID = allLists[n].getId();
  }
  
  var listIDs = [defaultID,tomorrowID,somedayID];
  
  for (var i = 0; i < listIDs.length; i++){
    var item = Tasks.Tasks.list(listIDs[i]).items;
    
    if (typeof item == 'undefined')
      continue;
    
    for (var j = 0; j < item.length; j++){
    
      if (i != 1 && typeof item[j].due == 'undefined')
        continue;
      
      if (i == 1 || item[j].due.split('T')[0] == today){
        Logger.log(item[j].title + " is due today");
        var newtask = Tasks.newTask().setTitle(item[j].title);
        Tasks.Tasks.insert(newtask, defaultID);
        var toDeleteID = item[j].getId();
        Tasks.Tasks.remove(listIDs[i], toDeleteID);
      }
      else if (item[j].due.split('T')[0] == tomorrow){
        Logger.log(item[j].title + " is due tomorrow");
        var newtask = Tasks.newTask().setTitle(item[j].title);
        Tasks.Tasks.insert(newtask, tomorrowID);
        var toDeleteID = item[j].getId();
        Tasks.Tasks.remove(listIDs[i], toDeleteID);
      }
    }
  }
}
