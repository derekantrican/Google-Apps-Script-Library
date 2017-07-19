function setStatus() {
 //https://api.slack.com/docs/presence-and-status

  var token = /* Get a token at https://api.slack.com/apps */;
  var apiEndpoint = "https://slack.com/api/";
  //var method = "users.list";
  var myUserID = "U2GH2RKFT";
  
  var method = "users.profile.set";
  var profile = {"status_text": "", "status_emoji" : ""};
  //var profile = {"status_text": "lunch"};
  //var profile = {"first_name": "Derek"};
  var payload = {"token": token, "user" : myUserID, "profile" : JSON.stringify(profile)};
  var payload1 = {"token": token, "user" : myUserID, "profile" : profile};
  Logger.log(payload)
  Logger.log(payload1);
  return;
  //var method = "users.setPresence";  
  //var payload = {"token": token, "user" : myUserID, "presence" : "auto"}; //Presence can either be "auto" or "away"

  var completeUrl = apiEndpoint + method;
  var jsonData = UrlFetchApp.fetch(completeUrl, {"method" : "post", "payload" : payload});
  var object = JSON.parse(jsonData.getContentText());
  Logger.log(object);
}

//"{\"channel\":\"channel_test\",\"username\":\"username_test\",\"text\":\"text_test\"}"
