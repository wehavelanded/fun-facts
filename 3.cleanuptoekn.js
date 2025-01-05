const fs = require('fs');

// File paths
const inputFilePath = './1.output.json'; // Path to your JSON file
const outputFilePath = './outputclean.json'; // Same file to overwrite or a new file for updated data

// Read the JSON file
fs.readFile(inputFilePath, 'utf8', (err, jsonData) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  try {
    // Parse the JSON data
    const data = JSON.parse(jsonData);

    // Process each object in the array
    data.forEach(item => {
      if (Array.isArray(item.tokens_involved)) {
        item.tokens_involved = item.tokens_involved.filter(
          token => !token.startsWith("So111111111111111")
        );
      }
    });

    // Write the updated data back to the file
    fs.writeFile(outputFilePath, JSON.stringify(data, null, 2), 'utf8', err => {
      if (err) {
        console.error('Error writing the file:', err);
        return;
      }
      console.log('JSON file successfully updated!');
    });
  } catch (parseError) {
    console.error('Error parsing JSON:', parseError);
  }
});
