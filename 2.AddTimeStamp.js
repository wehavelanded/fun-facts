const axios = require('axios');
const moment = require('moment');
const fs = require('fs');

// Read the input JSON file
const filePath = './output2.json';

const inputData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Function to fetch transaction details and update the data
async function fetchTransactionDetails(transaction) {
  const txKey = transaction.transactionLink.split('https://solscan.io/tx/')[1];
  const url = `https://api-v2.solscan.io/v2/transaction/detail?tx=${txKey}`;

  try {
    const response = await axios.get(url, {
      headers: {
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'cookie': '_ga=GA1.1.535911631.1734441943; _ga_PS3V7B7KV0=GS1.1.1736021036.7.1.1736025421.0.0.0; cf_clearance=yX04qNovFwoOasTCo11VOEHiflWXruf2d1LsnUhoPmw-1736025421-1.2.1.1-iqI02GnbaXp0o0VJYOStKWcB7u67bwmSEdw__tQkjFmDIs2SoRUuMr6dVCuMYK4EeiO9H_WjvY5nhVILFNES3qrzghpEyFN_XOlb6KzI5GgMEtstu.DJxVbKvsjYHsfjRGJECCwqThh0_zvl0T7rXryXddhViUQPmEIf9Pj5Kj1eOpgzry1gMID3NwMewpD0fkGxwvJuv06OmqLOFmnR5fOOI7gScIAij3oFeC4F6WPmkT16hVcUonwAXtue7XKHjnMIQNj8uwhyzqOTrqUI3KucIufZ.XKaCWXZmWwgmB5A1vxVcWvfDIwjSJXo4SdlirWMgOHt.BjLZwwqdJNcuPLlpGM7uHVySppbGnFImZANNYp3wHLmSV_fSQA4_asXiWE7iyOmRO0Qcd3wkP.2Zk6mk8mW.1t.bUsZfTsN3VhY_dAcIwZlkN3dQ1L3C2Ht1YdPfxYdFxvOK5R2DnjZdQ',
        'if-none-match': 'W/"82f6-f0CTcUDqa0TClIaRVaAdlJm4Pfs"',
        'origin': 'https://solscan.io',
        'referer': 'https://solscan.io/',
        'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'sol-aut': 'wy--mROH-eosSmAyI-xVNXwB9dls0fK8EIFUth3R',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      }
    });

    const transTime = response.data.data.trans_time;
    const tokensInvolved = response.data.data.tokens_involved;
    const humanReadableTime = moment.unix(transTime).format('YYYY-MM-DD HH:mm:ss');

    // Add the human-readable time and tokens_involved to the transaction object
    transaction.trans_Time = humanReadableTime;
    transaction.tokens_involved = tokensInvolved;

    console.log(`Axios call for transaction ${txKey} completed successfully.`);
    return transaction;
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    return transaction;
  }
}

// Process each transaction and update with trans_Time and tokens_involved
async function processTransactions() {
  const updatedTransactions = [];

  for (const transaction of inputData) {
    const updatedTransaction = await fetchTransactionDetails(transaction);
    updatedTransactions.push(updatedTransaction);
  }

  // Save the updated data to the same JSON file
  fs.writeFileSync(filePath, JSON.stringify(updatedTransactions, null, 2), 'utf8');
  console.log('File updated successfully');
}

// Run the script
processTransactions();
