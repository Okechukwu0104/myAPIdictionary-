const http = require('http');

// Replace YOUR_API_KEY with your actual API key from Merriam-Webster
const API_KEY = 'YOUR_API_KEY';

// Get command-line arguments
const word = process.argv[2];

// Build URL for API request
const url = `http://www.myAPIdictionary.com/api/v1/references/collegiate/xml/${word}?key=${API_KEY}`;

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
