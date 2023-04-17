const http = require('http');

// Replace YOUR_API_KEY with your actual API key from Merriam-Webster
const API_KEY = '4ee6d020-710d-4c37-9be9-60c7e4abd6cc';

// Get command-line arguments
const word = process.argv[2];

// Build URL for API request
const url = `https://dictionaryapi.com/api/v3/references/thesaurus/json/test?key=4ee6d020-710d-4c37-9be9-60c7e4abd6cc`;

// Make API request
http.get(url, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    // Parse XML response into JavaScript object
    const parser = new DOMParser();
    const xml = parser.parseFromString(data, 'text/xml');
    
    // Get first definition from response
    const definition = xml.querySelector('entry def').textContent;
    
    // Display definition to user
    console.log(`${word}: ${definition}`);
  });
}).on('error', (err) => {
  console.error(err);
});
