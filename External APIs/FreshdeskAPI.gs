//==========================================================================
// Use this file to interact with freshdesk.com. Please expand with other methods as needed!
// API documentation: https://developers.freshdesk.com/api/
//==========================================================================

var FRESHDESK_API_KEY = "INSERT_YOUR_API_KEY";
var FRESHDESK_SUB_DOMAIN = "INSERT_YOUR_FRESHDESK_SUB_DOMAIN";
var FRESHDESK_BASE_URL = "https://" + FRESHDESK_SUB_DOMAIN + ".freshdesk.com/api/v2";

function getTicketStatus(ticketID){
  var ticket = freshdeskGET("/tickets/" + ticketID);
  if (ticket == null)
    return null;
  
  if (ticket.status == 5)
    return "CLOSED";
  else
    return "OPEN";
}

function freshdeskGET(relativeUrl){                 
  var options = {"method" : "get",
                 "contentType": "application/json",
                 "muteHttpExceptions" : true,
                 "headers" : {"Authorization" : "Basic " + Utilities.base64Encode(FRESHDESK_API_KEY + ":X")}};
  
  var completeUrl = FRESHDESK_BASE_URL + relativeUrl;
  var jsonData = UrlFetchApp.fetch(completeUrl, options);
  return JSON.parse(jsonData);
}

function CreateFreshDeskTicket(subject, description, email, name, type){
  var url = FRESHDESK_BASE_URL + "/tickets";
  var authHeader = {"Authorization" : "Basic " + Utilities.base64Encode(FRESHDESK_API_KEY + ":X")};
  
  
  var payload = {"description" : description,
                 "subject" : subject,
                 "email" : email,
                 "name" : name,
                 "type" : type,
                 "status" : 2,
                 "priority" : 2};
  var options = {"method" : "post",
                 "contentType": "application/json",
                 "payload" : JSON.stringify(payload),
                 "muteHttpExceptions" : true,
                 "headers" : authHeader};
                 
  var jsonData = UrlFetchApp.fetch(url, options);
}
