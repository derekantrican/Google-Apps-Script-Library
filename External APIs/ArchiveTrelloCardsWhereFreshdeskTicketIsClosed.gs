//MAKE SURE YOU ALSO ADD THE FOLLOWING FILES TO YOUR GAS DOCUMENT:
// - https://github.com/derekantrican/Google-Apps-Script-Library/blob/master/External%20APIs/FreshdeskAPI.gs
// - https://github.com/derekantrican/Google-Apps-Script-Library/blob/master/External%20APIs/TrelloAPI.gs

function closeWhereFDTicketIsClosed() {
  var cards = getListCards("LIST_TO_CHECK");
  for (var i = 0; i < cards.length; i++){
    var ticketID = GetFDTicketID(cards[i]);
    if (ticketID != null){
      var status = getTicketStatus(ticketID);

      if (status == "CLOSED"){
        archiveCard(cards[i].id);
      }
    }
  }
}

function GetFDTicketID(trelloCard){
  var regex = RegExp(FRESHDESK_SUB_DOMAIN + "\.freshdesk\.com\/a\/tickets\/(\\d*)","g");
  var match = regex.exec(trelloCard.desc);
  if (match == null)
    return match;
    
  return match[1];
}
