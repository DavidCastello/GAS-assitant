const API_KEY = 'INSERT KEY HERE!';

function transcribeAudioForWhisper(file) {
  var audioFile = file;
  var openaiApiKey = API_KEY;
  const audioBlob = audioFile.getBlob();
  const modelName = 'whisper-1';
  const apiEndpoint = 'https://api.openai.com/v1/audio/transcriptions';

  const boundary = '-------' + Utilities.getUuid();
  const requestBodyStart =
    '--' +
    boundary +
    '\r\n' +
    'Content-Disposition: form-data; name="model"\r\n\r\n' +
    modelName +
    '\r\n' +
    '--' +
    boundary +
    '\r\n' +
    'Content-Disposition: form-data; name="file"; filename="' +
    audioFile.getName() +
    '"\r\n' +
    'Content-Type: ' +
    audioBlob.getContentType() +
    '\r\n\r\n';
  const requestBodyEnd = '\r\n--' + boundary + '--';

  const requestBody = Utilities.newBlob(
    Utilities.newBlob(requestBodyStart).getBytes()
      .concat(audioBlob.getBytes())
      .concat(Utilities.newBlob(requestBodyEnd).getBytes())
  );

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data; boundary=' + boundary,
      'Authorization': 'Bearer ' + openaiApiKey,
    },
    payload: requestBody.getBytes(),
    muteHttpExceptions: true,
  };

  const response = UrlFetchApp.fetch(apiEndpoint, requestOptions);
  const jsonResponse = JSON.parse(response.getContentText());
  const transcription = jsonResponse['text'];

  Logger.log(transcription)

  return myGPTFunction(transcription);
}

function getOpenAIResponse(transcription) {
  const openaiApiUrl = 'https://api.openai.com/v1/engines/text-davinci-003/completions';
  const apiKey = API_KEY; // Replace with your actual OpenAI API key

  // Set up the API request headers
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + apiKey,
  };

  // Construct the API request payload
  const payload = JSON.stringify({
    prompt: transcription,
    max_tokens: 100, // Adjust as needed
  });

  // Set up the API request options
  const options = {
    'method': 'post',
    'headers': headers,
    'payload': payload,
  };

  // Send the API request and parse the response
  try {
    const response = UrlFetchApp.fetch(openaiApiUrl, options);
    const jsonResponse = JSON.parse(response.getContentText());
    const textResponse = jsonResponse.choices[0].text.trim();
    return textResponse;
  } catch (error) {
    Logger.log('Error fetching response from OpenAI:', error);
    return null;
  }
}

const DOCUMENT_ID = 'INSERT DOCUMENT ID HERE WITH CUSTOM ISNTRUCTIONS';  // Document with custom isntructions
// View custom_instructions.txt for an example

function loadInstructions() {
  // Open the document by ID
  const document = DocumentApp.openById(DOCUMENT_ID);
  
  // Get the body of the document
  const body = document.getBody();
  
  // Get the text from the body
  const instructions = body.getText();
  
  // Return the instructions as a string
  return instructions;
}

function myGPTFunction(input){

  var instructions = loadInstructions();
  var prompt = instructions + input + "Response: ";
  var text_response = getOpenAIResponse(prompt);
  Logger.log(text_response);
  
  var custom_object = JSON.parse(text_response);
  
  const summary = custom_object.summary;
  const actions = custom_object.actions;

  return [summary, actions];

}

///////////////////////// unused

function escapeSingleQuotes(input) {
  // First, parse the input string to a JavaScript object
  let obj;
  try {
    obj = JSON.parse(input);
  } catch (e) {
    return "Invalid JSON input";
  }

  // Check if 'actions' property exists and is an array
  if (Array.isArray(obj.actions)) {
    // Iterate through the array and escape single quotes
    obj.actions = obj.actions.map(action => {
      // Replace single quotes with escaped single quotes
      return action.replace(/'/g, "\\'");
    });
  }

  // Convert the object back to a JSON string
  return JSON.stringify(obj);
}