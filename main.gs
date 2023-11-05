function checkForNewFiles() {
  
  const folderId = 'INSERT FOLDER ID HERE';
  const properties = PropertiesService.getScriptProperties();
  const lastRun = properties.getProperty('lastRun');
  const folder = DriveApp.getFolderById(folderId);
  const files = folder.getFiles();
  var summary = "";
  var actions = "";
  
  while (files.hasNext()) {
    const file = files.next();
    // this is to check if the file is actually new! const dateCreated = file.getDateCreated(); 
    const dateCreated = new Date() // to always run the script DEBUGGING PURPOSES

    if (lastRun) {
      const lastRunDate = new Date(lastRun);
      if (dateCreated > lastRunDate && isAudioFile(file)) {
        Logger.log("New Audio File: " + file.getName());
        [summary, actions] = transcribeAudioForWhisper(file);
        Logger.log(summary);
        executeActions(actions);
      
      }
    } else {
      // If no last run date is stored, consider all existing files as 'new'
      if (isAudioFile(file)) {
        Logger.log("New Audio File: " + file.getName());
        processAudio(file);
      }
    }
  }
  
  // Update the last run date
  properties.setProperty('lastRun', new Date());
}

function isAudioFile(file) {
  const mimeType = file.getMimeType();
  const fileName = file.getName();
  const fileExtension = fileName.split('.').pop().toLowerCase();
  
  // this is to make sure the file is audio!! return mimeType.startsWith('audio/') && fileExtension === 'mp3';
  return true;
}

//............ ACTIONS

const actionHandlers = {
  sendEmail: (input1, input2) => {
    // Logic to send an email
    Logger.log('Sending Email:');
    Logger.log(input1);
    Logger.log(input2);
  },
  logMessage: (input) => {
    // Logic to log a message
    Logger.log('Logging Message:');
    Logger.log(input);
  },
  // Add more actions as needed
}

//........................

function executeActions(actionsString) {
  // Split the actions string into individual actions
  const actions = actionsString.split(';').map(action => action.trim()).filter(Boolean);

  // Execute each action
  for (const action of actions) {
    // Match the action pattern "actionName('input1', 'input2', ...)"
    const match = action.match(/^(\w+)\(([^)]+)\)$/);
    if (match) {
      const actionName = match[1];
      const inputsString = match[2];
      // Split the inputs string into individual inputs, taking into account single quotes
      const inputs = inputsString.split(/'\s*,\s*'/).map(input => input.replace(/^'|'$/g, ''));

      // Check if the action handler exists
      const handler = actionHandlers[actionName];
      if (handler) {
        // Execute the handler with inputs
        handler(...inputs);
      } else {
        Logger.log('Action not found:', actionName);
      }
    } else {
      Logger.log('Invalid action format:', action);
      }
    }
  }

///////////////////////////////////

function createTrigger() {
  ScriptApp.newTrigger('checkForNewFiles')
    .timeBased()
    .everyMinutes(5) // You can change the time interval
    .create();
}
