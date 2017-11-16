function sendSms(number, message) {
  var accountSid = /* Get SID at https://www.twilio.com/user/account */;
  var authToken = /* Get token at https://www.twilio.com/user/account */;
  var url = "https://api.twilio.com/2010-04-01/Accounts/" + accountSid + "/Messages";
  var options = {
    method: "post",
    headers: {
      Authorization: "Basic " + Utilities.base64Encode(accountSid + ":" + authToken)
    },
    payload: {
      From: /*From is one of your Twilio phone numbers*/,
      To: number,
      Body: message
    }
  };
  var response = UrlFetchApp.fetch(url, options);
  Logger.log(response);
}

function doGet(args) {
  var from = args.parameter.From;
  var body = args.parameter.Body;
  
  return ContentService.createTextOutput('').setMimeType(ContentService.MimeType.TEXT);
}
