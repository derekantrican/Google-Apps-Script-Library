//==========================================================================
// Use this file to interact with Todoist.com. Please expand with other methods as needed!
// API documentation: https://developer.todoist.com/rest/
//==========================================================================

var TODOIST_API_KEY = "INSERT_YOUR_API_KEY";
var TODOIST_BASE_URL = "https://api.todoist.com/rest/v1";

function getTasks(projectId = null, sectionId = null, label_id = null, filter = null, language = null, ids = []) {
  var params = {
    "project_id" : projectId,
    "section_id" : sectionId,
    "label_id" : label_id,
    "filter" : filter,
    "lang" : language,
    "ids" : !ids || ids.length == 0 ? null : ids.join(','),
  };

  return todoistGET("/tasks", Object.keys(params).filter(k => params[k] != null).map(k => `${k}=${encodeURIComponent(params[k])}`).join('&'));
}

function getProjects() {
  return todoistGET("/projects");
}

function getInboxTasks() {
  var inboxProjectId = getProjects().find(p => p.inbox_project).id;
  return getTasks(inboxProjectId);
}

function todoistGET(endpoint, additionalParams = ""){
  var completeUrl = TODOIST_BASE_URL + endpoint + "?" + additionalParams;
  var options = {
    "method" : "get",
    "muteHttpExceptions" : true,
    "headers" : {
      "Authorization" : `Bearer ${TODOIST_API_KEY}`
    }
  };

  var jsonData = UrlFetchApp.fetch(completeUrl, options);
  return JSON.parse(jsonData.getContentText());
}
