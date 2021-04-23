//==========================================================================
// Adapted from https://github.com/davoam/anydo-api. Please expand with other methods as needed!
// Use the login method first to obtain an authToken, then store that authToken as a variable and use in future requests
//==========================================================================

const API_URL = 'https://sm-prod2.any.do';

function login(email, password){
  var json = anyDoPOST("/login", { email, password });
  return json.auth_token;
}

function sync(authToken){
  var json = anyDoPOST("/api/v2/me/sync", { "models" : syncSample(false, false)}, { "X-Anydo-Auth": authToken });
  return json;
}

function deleteTask(authToken, taskId){
  anyDoDELETE(`/me/tasks/${taskId}`, { "X-Anydo-Auth": authToken }); 
}

function anyDoPOST(relativeUrl, payload, headers){  
  var completeUrl = API_URL + relativeUrl;
  var options = {
                 "method" : "post",
                 "contentType" : "application/json",
                 "headers" : headers,
                 "payload" : JSON.stringify(payload)
                 };
  
  var jsonData = UrlFetchApp.fetch(completeUrl, options);
  return JSON.parse(jsonData.getContentText());
}

function anyDoDELETE(relativeUrl, headers){
  var completeUrl = API_URL + relativeUrl;
  var options = {
                 "method" : "delete",
                 "contentType" : "application/json",
                 "headers" : headers
                 };
  
  UrlFetchApp.fetch(completeUrl, options);
}

function syncSample(includeDone, includeDeleted){
  return {
      category: {
          items: []
      },
      task: {
          items: [],
          config: { includeDone, includeDeleted }
      },
      attachment: {
          items: []
      },
      sharedMember: {
          items: []
      },
      userNotification: {
          items: []
      },
      taskNotification: {
          items: []
      }
  };
}
