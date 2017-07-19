function sendSms(message) {
  var accountSid = /* Get SID at https://www.twilio.com/user/account */;
  var authToken = /* Get token at https://www.twilio.com/user/account */;
  var url = "https://api.twilio.com/2010-04-01/Accounts/" + accountSid + "/SMS/Messages.json";
  var options = {
    method: "post",
    headers: {
      Authorization: "Basic " + Utilities.base64Encode(accountSid + ":" + authToken)
    },
    payload: {
      From: "+15038979524", //From is one of your Twilio phone numbers
      To: "+15038775610",
      Body: message
    }
  };
  var response = UrlFetchApp.fetch(url, options);
  Logger.log(response);
}
