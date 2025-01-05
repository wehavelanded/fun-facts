const fs = require("fs");
const path = require("path");

// Define the trades folder path
const tradesFolder = path.join(__dirname, "buyTradesall");

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

        // Validate if the file is an array
        if (!Array.isArray(jsonData)) {
          console.warn(`File ${file} does not contain an array. Skipping.`);
          return;
        }

        // Add readable_time to each object
        const updatedData = jsonData.map(item => {
          if (item.timestamp) {
            item.readable_time = convertToReadableTimestamp(item.timestamp);
          } else {
            item.readable_time = "Timestamp missing"; // Handle missing timestamps
          }
          return item;
        });

        // Write the updated JSON back to the file
        fs.writeFile(filePath, JSON.stringify(updatedData, null, 2), err => {
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
