const fs = require("fs");
const path = require("path");

// Define the trades folder path
const tradesFolder = path.join(__dirname, "trades");

// Function to convert epoch timestamp to a readable timestamp
function convertToReadableTimestamp(epoch) {
  if (typeof epoch !== "number" || epoch <= 0) {
    return "Invalid timestamp"; // Fallback for invalid timestamps
  }

  const date = new Date(epoch * 1000); // Convert seconds to milliseconds
  if (isNaN(date.getTime())) {
    return "Invalid timestamp"; // Handle cases where Date construction fails
  }

  return date.toISOString(); // ISO 8601 format
}

// Process each JSON file in the folder
fs.readdir(tradesFolder, (err, files) => {
  if (err) {
    console.error("Error reading the trades folder:", err);
    return;
  }

  // Filter JSON files
  const jsonFiles = files.filter(file => file.endsWith(".json"));

  jsonFiles.forEach(file => {
    const filePath = path.join(tradesFolder, file);

    // Read and parse each JSON file
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error(`Error reading file ${file}:`, err);
        return;
      }

      try {
        const jsonData = JSON.parse(data);

        // Validate if timestamp exists in the JSON object
        if (!jsonData.timestamp) {
          console.warn(`No timestamp found in file ${file}. Skipping.`);
          return;
        }

        // Add the readable_timestamp property
        jsonData.readable_timestamp = convertToReadableTimestamp(jsonData.timestamp);

        // Write the updated JSON back to the file
        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), err => {
          if (err) {
            console.error(`Error writing to file ${file}:`, err);
          } else {
            console.log(`Updated file: ${file}`);
          }
        });
      } catch (parseErr) {
        console.error(`Error parsing JSON in file ${file}:`, parseErr);
      }
    });
  });
});
