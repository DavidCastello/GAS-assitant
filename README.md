# **Google Apps Script: Audio File Processing Automation**

## **Overview**

This Google Apps Script is designed to automate the processing of audio files stored in a Google Drive folder. It uses OpenAI's Whisper API for transcription and the OpenAI text completion API to generate responses based on the transcribed text.

## **Features**

- Checks a Google Drive folder for new audio files.
- Transcribes audio files using OpenAI's Whisper API.
- Generates custom responses using OpenAI's GPT model based on the transcribed text.
- Performs predefined actions based on these generated responses.
- Regularly triggers to process new files.

## **Requirements**

- Access to Google Drive and Google Apps Script.
- OpenAI API key for accessing Whisper and GPT APIs.
- A Google Drive folder ID where audio files are stored.

## **Setup and Configuration**

1. **Create a Google Apps Script Project**:
    - Go to [Google Apps Script](https://script.google.com/) and create a new project.
2. **Paste the Script**:
    - Copy and paste the provided script into the script editor.
3. **Configure Folder and Document IDs**:
    - Replace the placeholder folder and document IDs with the IDs of your Google Drive folder and the Google Docs document containing custom instructions.
4. **Set up OpenAI API Key**:
    - Replace **`'INSERT YOUR API KEY'`** with your actual OpenAI API key.
5. **Create a Trigger**:
    - Run the **`createTrigger`** function to set up a time-based trigger for regular execution.

## **Usage**

- The script will automatically run at the specified interval (default every 5 minutes) to check for new audio files.
- New audio files are transcribed, and responses are generated based on the content of the transcription.
- Custom actions are executed based on these responses.

## **Customizing the Script**

- **Change Check Interval**: Adjust the interval in **`createTrigger`** to change how frequently the script checks for new files.
- **Modify Transcription and Response Logic**: Adapt **`transcribeAudioForWhisper`** and **`myGPTFunction`** for specific transcription and response generation requirements.
- **Update Custom Actions**: Expand or modify the **`actionHandlers`** to define custom actions based on response content.

## **Troubleshooting**

- Ensure you have the correct permissions to access the specified Google Drive folder and document.
- Verify the OpenAI API key is correct and has the necessary permissions.
- Check if the script's trigger is correctly set up and functioning.

## **Notes**

- This script is for demonstration purposes and may require modifications to work in your specific environment.
- Regular checks and maintenance of the script are recommended to ensure smooth operation.
