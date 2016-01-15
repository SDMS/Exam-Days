function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Essay Day 2')
  .addItem('Send Links', 'showPrompt')
  .addToUi();
}

var baseurl = "https://docs.google.com/a/wethersfield.me/forms/d/1nVRUBW3jTZ3Ac5cCfNKs91M-OtTkbrsw4wX34y5IQkg/viewform?";

function showPrompt() {
  var ui = SpreadsheetApp.getUi(); // Same variations.

  var result = ui.prompt(
      'Section',
      'Which section do you want to send? Type a single capital letter.',
      ui.ButtonSet.OK_CANCEL);

  // Process the user's response.
  var button = result.getSelectedButton();
  var text = result.getResponseText();
  if (button == ui.Button.OK) {
    // User clicked "OK".
    sendEmails(text);
  }
}

function sendEmails(section) {
  var sheet = SpreadsheetApp.getActiveSheet();
  var startRow = 2;
  var numRows = sheet.getLastRow() - 1;
  var dataRange = sheet.getRange(startRow, 1, numRows, 6);
  var data = dataRange.getValues();
  for (i in data) {
    var row = data[i];
    if(row[3] == section){
      var emailAddress = row[5];
      var message = "Hello " + row[1] + " " + row[2] + ",\n\n";
      message += "Here is the link to your work:";
      message += shortenUrl(getLongUrl(row));
      var subject = "Science Essay Day 2";
      MailApp.sendEmail(emailAddress, subject, message);
    }
  }

}

function getLongUrl(row){
  var long_url = baseurl;
  long_url += "entry.1873857323=" + row[1];
  long_url += "&entry.1041319822=" + row[2];
  long_url += "&entry.254581400=" + row[5];
  long_url += "&entry.1813080960=" + row[3];
  long_url += "&entry.1093305369=";
  
  var essay = row[4];
  essay = essay.replace(/(?:\r\n|\r|\n)/g, '%0A');
  essay = essay.replace(/ /g, '+');
  
  long_url += essay;
  return long_url;
  
}

/*
  Resources > Advanced Google Services. Turn on URL Shortener.
  Go to Developer Console. Create a new project. Enable URL Shortener via API Manager.
  Go back to Dashboard on Dev. Console and copy the Project Number.
  Resources > Developer Console Project
  Set project using the Project Number you just got.
*/

function shortenUrl(url){   

      var longUrl = UrlShortener.newUrl();
      longUrl.setLongUrl(url);

      var shortUrl = UrlShortener.Url.insert(longUrl);

      return shortUrl.getId();
}
