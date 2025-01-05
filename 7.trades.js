const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Input file containing tokens and their addresses
const inputFile = path.join(__dirname, '6.files_without_target_user.json');

// Base URL for the API
const baseURL = 'https://frontend-api.pump.fun/trades/all/';

// Function to fetch data and save the response
const fetchAndSave = (address) => {
  const url = `${baseURL}${address}?limit=500&offset=0&minimumSize=1`;
  const outputFile = path.join(__dirname, `trades2/${address}.json`);

  // Execute the curl command
  const curlCommand = `curl --silent -X 'GET' '${url}' -H 'accept: */*'`;
  exec(curlCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error fetching data for ${address}:`, error.message);
      return;
    }
    if (stderr) {
      console.error(`Curl stderr for ${address}:`, stderr.trim());
    }

    if (stdout) {
      // Save the response to a file
      fs.writeFile(outputFile, stdout, 'utf8', (writeErr) => {
        if (writeErr) {
          console.error(`Error writing file for ${address}:`, writeErr);
        } else {
          console.log(`Data for ${address} saved to ${outputFile}`);
        }
      });
    } else {
      console.error(`No response for ${address}.`);
    }
  });
};

// Read the input file and process the addresses
fs.readFile(inputFile, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  try {
    const jsonData = JSON.parse(data);

    // Loop through each entry and process tokens_involved
    jsonData.forEach((address) => {
      fetchAndSave(address);
    });
  } catch (parseErr) {
    console.error('Error parsing JSON:', parseErr);
  }
});
