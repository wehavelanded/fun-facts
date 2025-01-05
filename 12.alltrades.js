const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Input file containing tokens and their addresses
const inputFile = path.join(__dirname, 'buys-on-pump.json');

// Base URL for the API
const baseURL = 'https://frontend-api.pump.fun/trades/all/';

// Directory to save combined output
const outputDir = path.join(__dirname, 'buyTradesall');

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Function to make a curl request
const fetchData = (address, offset, limit = 200) => {
  return new Promise((resolve, reject) => {
    const url = `${baseURL}${address}?limit=${limit}&offset=${offset}&minimumSize=1`;
    const curlCommand = `curl --silent -X 'GET' '${url}' -H 'accept: */*'`;

    exec(curlCommand, (error, stdout, stderr) => {
      if (error) {
        reject(`Error fetching data for ${address} (offset ${offset}): ${error.message}`);
      } else if (stderr) {
        reject(`Curl stderr for ${address} (offset ${offset}): ${stderr.trim()}`);
      } else {
        resolve(stdout);
      }
    });
  });
};

// Function to process data for each address
const processAddress = async (address) => {
  const calls = [
    fetchData(address, 0),
    fetchData(address, 200),
    fetchData(address, 400),
  ];

  try {
    // Wait for all API responses
    const responses = await Promise.all(calls);

    // Combine all responses into one JSON array
    const combinedData = responses
      .map((response) => JSON.parse(response)) // Parse each response
      .flat(); // Flatten the array of arrays

    // Save combined data to a file
    const outputFile = path.join(outputDir, `${address}.json`);
    fs.writeFileSync(outputFile, JSON.stringify(combinedData, null, 2), 'utf8');
    console.log(`Combined data for ${address} saved to ${outputFile}`);
  } catch (err) {
    console.error(`Error processing ${address}:`, err);
  }
};

// Read the input file and process each address
fs.readFile(inputFile, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  try {
    const jsonData = JSON.parse(data);

    // Process each address in the JSON data
    jsonData.forEach(({ tokens_involved }) => {
      tokens_involved.forEach((address) => {
        processAddress(address);
      });
    });
  } catch (parseErr) {
    console.error('Error parsing JSON:', parseErr);
  }
});
