function setFollowUpReminders() {
  var lists, cards, labels;
  var userBoards;
  userBoards = trelloFetch("/members/derekantrican/").idBoards;
  
  for (var i = 0; i < userBoards.length; i++){
    cards = trelloFetch("/boards/" + userBoards[i] + "/cards/");

    for (var j = 0; j < cards.length; j++){
      labels = cards[j].labels;
      
      if (labels.length < 1)
        continue;

      for (var k = 0; k < labels.length; k++){
        if (labels[k].name != "" && labels[k].name.indexOf("@") >= 0){
          GmailApp.sendEmail(labels[k].name, cards[j].name, cards[j].url);
          deleteLabel(labels[k].id);
        }
      }
    }
  }
}

function deleteLabel(idLabel){
  var key = /* Get an API Key at https://trello.com/app-key */,
      api_endpoint = "https://api.trello.com/1",
      member_token = /* Get a token at https://trello.com/app-key */;
  var completeUrl = api_endpoint + "/labels/" + idLabel + "?key=" + key + "&token=" + member_token;
  
  var jsonData = UrlFetchApp.fetch(completeUrl, {"method" : "delete"});
  var object = JSON.parse(jsonData.getContentText());
  Logger.log(object);
}

function trelloFetch(url) {
  var key = /* Get an API Key at https://trello.com/app-key */,
      api_endpoint = "https://api.trello.com/1",
      member_token = /* Get a token at https://trello.com/app-key */;
  var completeUrl = api_endpoint + url + "?key=" + key + "&token=" + member_token;
  
  var jsonData = UrlFetchApp.fetch(completeUrl);
  var object = JSON.parse(jsonData.getContentText());
  
  return object;
}
