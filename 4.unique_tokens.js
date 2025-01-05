const fs = require('fs');
const path = require('path');

// Input and output file paths
const inputFile = path.join(__dirname, '3.outputclean.json');
const outputFile = path.join(__dirname, '4.unique_tokens.json');

// Read the JSON file
fs.readFile(inputFile, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  try {
    const jsonData = JSON.parse(data);

    // Extract unique tokens_involved addresses grouped by token
    const result = {};
    jsonData.forEach((entry) => {
      const { token, tokens_involved } = entry;

      if (!result[token]) {
        result[token] = new Set();
      }

      tokens_involved.forEach((address) => result[token].add(address));
    });

    // Convert Set to array and format the output
    const formattedResult = Object.keys(result).map((key) => ({
      token: key,
      tokens_involved: Array.from(result[key]),
    }));

    // Write the result to a new JSON file
    fs.writeFile(outputFile, JSON.stringify(formattedResult, null, 2), 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Error writing the file:', writeErr);
        return;
      }
      console.log('File written successfully to', outputFile);
    });
  } catch (parseErr) {
    console.error('Error parsing JSON:', parseErr);
  }
});
