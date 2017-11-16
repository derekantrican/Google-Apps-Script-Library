function SendSMS(number, message){
  // Get account SID and auth token here:
  //   https://www.twilio.com/user/account
  var authId = /* Get authId from plivo.com*/;
  var authToken = /* Get authToken from plivo.com*/;
  var url = "https://api.plivo.com/v1/Account/" + authId + "/Message/";
  var options = {
    method: "post",
    headers: {'Authorization' : 'Basic ' + Utilities.base64Encode(authId + ':' + authToken), 'Content-Type': 'application/json'},
    payload: JSON.stringify({
      src: /*src is one of your Plivo numbers*/,
      dst: number,
      text: message
    })
  };
  var response = UrlFetchApp.fetch(url, options);
  Logger.log(response);
}

function doGet(args){
  var message = args.parameters.Text;
  var number = args.parameters.From;
  
  return ContentService.createTextOutput('').setMimeType(ContentService.MimeType.TEXT);
}
