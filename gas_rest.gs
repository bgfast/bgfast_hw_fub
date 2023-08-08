var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
var settingsSheet = spreadsheet.getSheetByName("Settings");
// Your Follow Up Boss API key
var apiKey = settingsSheet.getRange("B2").getValue();

function fetchSmartLists() {
  // Your Follow Up Boss API key
  
  // The URL of the Smart Lists API endpoint
  var apiUrl = 'https://api.followupboss.com/v1/smartLists';
  
  // Set up the headers
  var headers = {
    'Authorization': 'Basic ' + Utilities.base64Encode(apiKey + ':')
  };
  
  // Fetch the data
  var response = UrlFetchApp.fetch(apiUrl, {
    'method': 'get',
    'headers': headers
  });
  
  // Parse the response
  var responseData = JSON.parse(response.getContentText());
  
  // Do something with the responseData (e.g., log to the console)
  Logger.log(responseData);
}


function fetchSmartListUsers() {
  
  // The ID of the Smart List you want to retrieve users from
  var smartListId = '5'; // Replace with the actual Smart List ID
  
  // The URL of the Smart List API endpoint
  var apiUrl = 'https://api.followupboss.com/v1/smartLists/' + smartListId + '/people';
  
  // Set up the headers
  var headers = {
    'Authorization': 'Basic ' + Utilities.base64Encode(apiKey + ':')
  };
  
  // Fetch the data
  var response = UrlFetchApp.fetch(apiUrl, {
    'method': 'get',
    'headers': headers
  });
  
  // Parse the response
  var responseData = JSON.parse(response.getContentText());
  
  // Get the active spreadsheet
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // Get the first sheet in the spreadsheet
  var sheet = spreadsheet.getSheets()[0];
  
  // Clear existing data in the sheet
  sheet.clearContents();
  
  // Write the headers
  var headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Created At', 'Updated At'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Write the data to the sheet
  var data = [];
  for (var i = 0; i < responseData.people.length; i++) {
    var person = responseData.people[i];
    data.push([
      person.id,
      person.firstName,
      person.lastName,
      person.email,
      person.phone,
      person.createdAt,
      person.updatedAt
    ]);
  }
  sheet.getRange(2, 1, data.length, data[0].length).setValues(data);
}

