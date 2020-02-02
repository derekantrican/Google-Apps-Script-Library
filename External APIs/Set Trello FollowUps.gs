//MAKE SURE YOU ALSO ADD THE FOLLOWING FILE TO YOUR GAS DOCUMENT:
// - https://github.com/derekantrican/Google-Apps-Script-Library/blob/master/External%20APIs/TrelloAPI.gs

function setFollowUpReminders() {
  var lists, cards, labels;
  var userBoards;
  userBoards = getBoardIDsForUser("YOUR_TRELLO_USERNAME"); //This returns a list of board IDs (not boards)
  
  for (var i = 0; i < userBoards.length; i++){
    cards = getBoardCards(userBoards[i]);

    for (var j = 0; j < cards.length; j++){
      labels = cards[j].labels;
      
      if (labels.length < 1)
        continue;

      for (var k = 0; k < labels.length; k++){
        if (labels[k].name != "" &&labels[k].name.indexOf("@") >= 0){
          GmailApp.sendEmail(labels[k].name, cards[j].name, cards[j].url);
          deleteLabelFromBoard(labels[k].id);
        }
      }
    }
  }
}
