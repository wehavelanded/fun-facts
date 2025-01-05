const fs = require('fs');
const path = require('path');

// Function to find files that do not contain the target user
function findFilesWithoutUser(folderPath, targetUser) {
    const filesWithoutTargetUser = [];

    // Read all files in the folder
    const files = fs.readdirSync(folderPath);

    files.forEach((file) => {
        if (path.extname(file) === '.json') {
            const filePath = path.join(folderPath, file);

            try {
                const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

                // Check if the target user exists in any object in the file
                const hasTargetUser = data.some((item) => item.user === targetUser);

                if (!hasTargetUser) {
                    filesWithoutTargetUser.push(file);
                }
            } catch (error) {
                console.error(`Error processing file ${file}: ${error.message}`);
            }
        }
    });

    return filesWithoutTargetUser;
}

// Usage
const folderPath = './trades/'; // Replace with your folder path
const targetUser = 'DfMxre4cKmvogbLrPigxmibVTTQDuzjdXojWzjCXXhzj';

const files = findFilesWithoutUser(folderPath, targetUser);

const outputFilePath = './files_without_target_user.json'; // Path to the output file

// Save the result to a JSON file
fs.writeFileSync(outputFilePath, JSON.stringify(files, null, 2), 'utf-8');

console.log(`Result saved to ${outputFilePath}`);
