const fs = require('fs');

// Load the JSON files
const transactionsFilePath = '1.output.json';
const addressesFilePath = '6.files_without_target_user.json';
const outputFilePath = 'buys-on-pump.json';

// Read the transactions and addresses
const transactions = JSON.parse(fs.readFileSync(transactionsFilePath, 'utf8'));
const addresses = new Set(JSON.parse(fs.readFileSync(addressesFilePath, 'utf8')));

// Filter the transactions
const filteredTransactions = transactions.filter(transaction => {
  if (transaction.action === "Buy") {
    // Check if any token_involved address matches an address from the list
    return !transaction.tokens_involved.some(token => addresses.has(token));
  }
  return false;
});

// Save the filtered transactions to a new file
fs.writeFileSync(outputFilePath, JSON.stringify(filteredTransactions, null, 2), 'utf8');

console.log(`Filtered transactions saved to ${outputFilePath}`);
