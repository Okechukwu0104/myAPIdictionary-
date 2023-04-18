const https = require('https');
const readline = require('readline');

// API key for the Merriam-Webster API
const API_KEY = 'your_api_key_here';

// Base URL for the Merriam-Webster API
const API_URL = `https://www.dictionaryapi.com/api/v3/references`;

// Create a readline interface for reading user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to fetch the definition or translation of a word from the Merriam-Webster API
function fetchWord(word, lang='en') {
  // Construct the URL for the API request
  const url = `${API_URL}/${lang}/${encodeURIComponent(word)}?key=${API_KEY}`;

  // Send an HTTPS request to the API
  https.get(url, res => {
    let data = '';
    res.on('data', chunk => {
      data += chunk;
    });
    res.on('end', () => {
      try {
        // Parse the JSON response from the API
        const response = JSON.parse(data);

        // If the response is an array of definitions, print them
        if (Array.isArray(response)) {
          console.log(`Definitions of "${word}":`);
          response.forEach((definition, index) => {
            console.log(`${index + 1}. ${definition.meta.id}: ${definition.fl} ${definition.shortdef.join(', ')}`);
          });
        }

        // If the response is a single definition, print it
        else if (response.meta) {
          console.log(`Definition of "${word}":`);
          console.log(`${response.meta.id}: ${response.fl} ${response.shortdef.join(', ')}`);
        }

        // If the response is an array of translations, print them
        else if (Array.isArray(response.translation)) {
          console.log(`Translations of "${word}":`);
          response.translation.forEach((translation, index) => {
            console.log(`${index + 1}. ${translation.text} (${translation.partOfSpeech})`);
          });
        }

        // If the response is a single translation, print it
        else if (response.translation) {
          console.log(`Translation of "${word}":`);
          console.log(`${response.translation.text} (${response.translation.partOfSpeech})`);
        }

        // If the response is an error message, print it
        else if (response.message) {
          console.log(`Error: ${response.message}`);
        }

        // If the response is invalid, print an error message
        else {
          console.log(`Error: invalid response from API`);
        }
      } catch (error) {
        console.log(`Error: ${error.message}`);
      }
    });
  }).on('error', error => {
    console.log(`Error: ${error.message}`);
  });
}

// Prompt the user to enter a word
rl.question('Enter a word: ', word => {
  // Fetch the definition or translation of the word from the API
  fetchWord(word);

  // Close the readline interface
  rl.close();
});
