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

function getTask(taskId) {
  return todoistGET(`/tasks/${taskId}`);
}

function getProjects() {
  return todoistGET("/projects");
}

function getInboxTasks() {
  var inboxProjectId = getProjects().find(p => p.inbox_project).id;
  return getTasks(inboxProjectId);
}

function getLabels() {
  return todoistGET("/labels");
}

function updateTask(taskId, data) {
  todoistPOST(`/tasks/${taskId}`, data);
}

function createTask(data) {
  todoistPOST("/tasks", data);
}

function completeTask(taskId) {
  todoistPOST(`/tasks/${taskId}/close`);
}

function commentOnTask(taskId, comment) {
  return todoistPOST(`/comments`, {
    'task_id' : taskId,
    'content' : comment,
  });
}

function getCommentsOnTask(taskId) {
  return todoistGET('/comments', `task_id=${taskId}`);
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
  if (jsonData.getResponseCode() / 100 == 2 && jsonData.getContentText()) {
    return JSON.parse(jsonData.getContentText());
  }
}

function todoistPOST(endpoint, payload){
  var completeUrl = TODOIST_BASE_URL + endpoint;
  var options = {
    "method" : "post",
    "muteHttpExceptions" : true,
    "contentType": "application/json",
    "headers" : {
      "Authorization" : `Bearer ${TODOIST_API_KEY}`,
    },
    "payload" : JSON.stringify(payload)
  };

  var jsonData = UrlFetchApp.fetch(completeUrl, options);
  if (jsonData.getContentText()) {
    return JSON.parse(jsonData.getContentText());
  }
}
