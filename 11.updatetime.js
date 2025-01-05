const fs = require('fs');
const path = require('path');

// Folder containing JSON files
const buyTradesFolder = path.join(__dirname, 'buytrades');

// Function to convert epoch time to human-readable format
const convertToHumanReadableTime = (epoch) => {
    const date = new Date(epoch * 1000); // Convert seconds to milliseconds
    return date.toISOString(); // Returns time in ISO 8601 format
};

// Read all files in the buytrades folder
fs.readdir(buyTradesFolder, (err, files) => {
    if (err) {
        console.error('Error reading buytrades folder:', err);
        return;
    }

    files.forEach((file) => {
        const filePath = path.join(buyTradesFolder, file);

        // Read each file
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(`Error reading file ${file}:`, err);
                return;
            }

            try {
                const objects = JSON.parse(data);

                // Update each object with humanReadableTime
                const updatedObjects = objects.map((obj) => ({
                    ...obj,
                    humanReadableTime: convertToHumanReadableTime(obj.timestamp),
                }));

                // Write the updated data back to the file
                fs.writeFile(filePath, JSON.stringify(updatedObjects, null, 2), (err) => {
                    if (err) {
                        console.error(`Error writing to file ${file}:`, err);
                    } else {
                        console.log(`Updated file: ${file}`);
                    }
                });
            } catch (parseError) {
                console.error(`Error parsing JSON in file ${file}:`, parseError);
            }
        });
    });
});
