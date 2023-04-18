const http = require('http');
const readline = require('readline');

// Replace YOUR_API_KEY with your actual API key
const API_KEY = '391a2b5-323c-40be-9faa-addda2e9a0c5';
const API_HOST = 'www.dictionaryapi.com';
const API_PATH = '/api/v3/references/ithesaurus/json/';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function fetchWordDefinition(word) {
  const url = `http://${API_HOST}${API_PATH}${encodeURIComponent(word)}?key=${API_KEY}`;

  http.get(url, (res) => {
    let body = '';
    res.on('data', (chunk) => {
      body += chunk;
    });
    res.on('end', () => {
      try {
        const data = JSON.parse(body);
        if (Array.isArray(data) && data.length > 0 && data[0].shortdef) {
          console.log(`\nDefinitions for ${word}:`);
          data[0].shortdef.forEach((definition, i) => {
            console.log(`${i + 1}. ${definition}`);
          });
        } else {
          console.log(`No definitions found for ${word}`);
        }
      } catch (err) {
        console.error(`Error parsing JSON response: ${err}`);
      }
    });
  }).on('error', (err) => {
    console.error(`Error fetching word definition: ${err}`);
  });
}

rl.question('Enter a word: ', (word) => {
  fetchWordDefinition(word);
  rl.close();
});
