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

function fetchSmartListUsers2() {
  // Get the API key from cell B2 on the "Settings" sheet
  //var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  //var settingsSheet = spreadsheet.getSheetByName("Settings");
  //var apiKey = settingsSheet.getRange("B2").getValue();
  
  // The ID of the Smart List you want to retrieve users from
  var smartListId = '5'; // Replace with the actual Smart List ID
  
  // The URL of the People API endpoint
  var apiUrl = 'https://api.followupboss.com/v1/people';
  
  // Create the authentication header
  var headers = {
    'Authorization': 'Basic ' + Utilities.base64Encode(apiKey + ':')
  };
  
  // Fetch all people
  var response = UrlFetchApp.fetch(apiUrl, {
    'method': 'get',
    'headers': headers
  });
  
  // Parse the response
  var responseData = JSON.parse(response.getContentText());
  Logger.log(responseData);

  // Filter people based on the smart list
  var smartListUsers = responseData.people.filter(function(person) {
    return person.smartLists.includes(smartListId);
  });
  
  // Get the active spreadsheet
  var sheet = spreadsheet.getSheets()[0];
  
  // Clear existing data in the sheet
  sheet.clearContents();
  
  // Write the headers
  var headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Created At', 'Updated At'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Write the filtered data to the sheet
  var data = [];
  for (var i = 0; i < smartListUsers.length; i++) {
    var person = smartListUsers[i];
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
function getAllPeople(smartListId) {
  var allPeople = [];
  var nextPageToken = null;

  do {
    //var apiUrl = 'https://api.followupboss.com/v1/people';
    var apiUrl = "https://api.followupboss.com/v1/people?sort=created&limit=100&offset=0&fields=allFields&smartListId="+smartListId+"&includeTrash=false&includeUnclaimed=false"

    // Add the nextPageToken if available
    if (nextPageToken) {
      apiUrl += '?page=' + nextPageToken;
    }
  
    // Create the authentication header
    var headers = {
      'Authorization': 'Basic ' + Utilities.base64Encode(apiKey + ':')
    };
  
    // Fetch people
    var response = UrlFetchApp.fetch(apiUrl, {
      'method': 'get',
      'headers': headers
    });
  
    // Parse the response
    var responseData = JSON.parse(response.getContentText());
  
    // Append the fetched people to the allPeople array
    allPeople = allPeople.concat(responseData.people);

    // Get the nextPageToken for pagination
    nextPageToken = responseData.nextPageToken;
  } while (nextPageToken);

  return allPeople;
}

function processAllPeople() {
  // Get the API key from cell B2 on the "Settings" sheet
  
  // Get all people
  var hotPeople = getAllPeople("5");
  var ccPeople = getAllPeople("34");
  var nurturePeople = getAllPeople("6");
  var watchPeople = getAllPeople("32");
  // 34 = Current Clients
  // 5 = Hot
  // 6 = Nurture
  // 32 = Watch
  // Get the active spreadsheet
  var sheet = spreadsheet.getSheets()[0];
  
  // Clear existing data in the sheet
  // Clear the contents of column 1 and 2
  sheet.clearContents();
  
  // Write the headers
  var headers = ['Hot','Notes', '', 'Current Clients', 'Notes','', 'Nurture', 'Notes','', 'Watch', 'Notes'];
  //var headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Created At', 'Updated At'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  

  // Write the Hot data to the sheet
  var data = [];
  for (var i = 0; i < hotPeople.length; i++) {
    var person = hotPeople[i];
    //Logger.log(person)
    data.push([
      person.firstName + " " + person.lastName
    ]);
  }
  sheet.getRange(2, 1, data.length, data[0].length).setValues(data);

  // Write the Current clients data to the sheet
  var data = [];
  for (var i = 0; i < ccPeople.length; i++) {
    var person = ccPeople[i];
    //Logger.log(person)
    data.push([
      person.firstName + " " + person.lastName
    ]);
  }
  sheet.getRange(2, 4, data.length, data[0].length).setValues(data);

  // Write the Nurture clients data to the sheet
  var data = [];
  for (var i = 0; i < nurturePeople.length; i++) {
    var person = nurturePeople[i];
    //Logger.log(person)
    data.push([
      person.firstName + " " + person.lastName
    ]);
  }
  sheet.getRange(2, 7, data.length, data[0].length).setValues(data);

  // Write the Watch clients data to the sheet
  var data = [];
  for (var i = 0; i < watchPeople.length; i++) {
    var person = watchPeople[i];
    //Logger.log(person)
    data.push([
      person.firstName + " " + person.lastName
    ]);
  }
  sheet.getRange(2, 10, data.length, data[0].length).setValues(data);


}

