const fs = require('fs');
const path = require('path');

// Paths
const tradesFilePath = path.join(__dirname, 'buys-on-pump.json');
const tradesFolder = path.join(__dirname, 'trades');
const buyTradesFolder = path.join(__dirname, 'buytrades');

// Ensure the `buytrades` folder exists
if (!fs.existsSync(buyTradesFolder)) {
    fs.mkdirSync(buyTradesFolder);
}

// Read and process the trades JSON file
fs.readFile(tradesFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading trades file:', err);
        return;
    }

    try {
        const trades = JSON.parse(data);

        // Process each trade
        trades.forEach((trade) => {
            trade.tokens_involved.forEach((token) => {
                const sourceFile = path.join(tradesFolder, `${token}.json`);
                const destinationFile = path.join(buyTradesFolder, `${token}.json`);

                // Check if the source file exists
                if (fs.existsSync(sourceFile)) {
                    // Copy the file to the buytrades folder
                    fs.copyFile(sourceFile, destinationFile, (err) => {
                        if (err) {
                            console.error(`Error copying file for token ${token}:`, err);
                        } else {
                            console.log(`Copied ${token}.json to buytrades folder.`);
                        }
                    });
                } else {
                    console.warn(`File for token ${token} does not exist in trades folder.`);
                }
            });
        });
    } catch (parseError) {
        console.error('Error parsing trades JSON:', parseError);
    }
});
