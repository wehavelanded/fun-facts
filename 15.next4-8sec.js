const fs = require("fs");
const path = require("path");

// File paths
const buysOnPumpFile = path.join(__dirname, "buys-on-pump.json");
const tradesFolder = path.join(__dirname, "buyTradesall");
const outputFolder = path.join(__dirname, "nextInterval4-6sec");

// Ensure the output folder exists
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

// Function to find the trade between 4 and 8 seconds later
function findTradeInRange(trades, targetTimestamp) {
  return trades
    .filter(trade => trade.timestamp > targetTimestamp + 4 && trade.timestamp <= targetTimestamp + 8)
    .sort((a, b) => a.timestamp - b.timestamp)[0]; // Pick the earliest trade in this range
}

// Function to merge objects with priority for sol_amount and token_amount from buys-on-pump
function mergeObjects(buysOnPumpObj, tradeObj) {
  return {
    ...tradeObj,
    ...buysOnPumpObj,
    sol_amount: buysOnPumpObj.sol_amount,
    token_amount: buysOnPumpObj.token_amount,
  };
}

// Process the buys-on-pump.json file
fs.readFile(buysOnPumpFile, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading buys-on-pump.json:", err);
    return;
  }

  let buysOnPump;
  try {
    buysOnPump = JSON.parse(data);
  } catch (parseErr) {
    console.error("Error parsing buys-on-pump.json:", parseErr);
    return;
  }

  // Process each trade in buys-on-pump.json
  buysOnPump.forEach(buyTrade => {
    const tokensInvolved = buyTrade.tokens_involved;
    if (!tokensInvolved || !tokensInvolved.length) {
      console.warn("No tokens_involved found for trade:", buyTrade);
      return;
    }

    const address = tokensInvolved[0];
    const tradeFile = path.join(tradesFolder, `${address}.json`);

    // Read the corresponding address file
    fs.readFile(tradeFile, "utf8", (err, tradeData) => {
      if (err) {
        console.error(`Error reading file for address ${address}:`, err);
        return;
      }

      let trades;
      try {
        trades = JSON.parse(tradeData);
      } catch (parseErr) {
        console.error(`Error parsing JSON for address ${address}:`, parseErr);
        return;
      }

      // Locate the matching trade in the address file
      const matchingTrade = trades.find(
        trade =>
          trade.is_buy === true &&
          trade.signature === buyTrade.transactionLink.split("/").pop() &&
          trade.user
      );

      if (!matchingTrade) {
        console.warn(`No matching trade found for ${buyTrade.transactionLink}`);
        return;
      }

      // Merge the objects
      const mergedTrade = mergeObjects(buyTrade, matchingTrade);

      // Find the trade between 4 and 8 seconds later
      const tradeInRange = findTradeInRange(trades, matchingTrade.timestamp);

      if (!tradeInRange) {
        console.warn(`No trade found between 4 and 8 seconds later for ${matchingTrade.signature}`);
        return;
      }

      // Generate a unique filename using user and signature
      const uniqueFileName = `${matchingTrade.user}_${matchingTrade.signature}.json`;
      const outputFilePath = path.join(outputFolder, uniqueFileName);

      const outputData = {
        merged_trade: mergedTrade,
        trade_in_range: tradeInRange,
      };

      // Write the new file
      fs.writeFile(outputFilePath, JSON.stringify(outputData, null, 2), err => {
        if (err) {
          console.error(`Error writing to file ${uniqueFileName}:`, err);
        } else {
          console.log(`Written to file: ${uniqueFileName}`);
        }
      });
    });
  });
});
