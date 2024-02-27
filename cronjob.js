import fetch from 'node-fetch';

const url = 'https://www.carcenter-erding.de/api/mobile';

const fetchDataWithRetry = async (url, retries = 9999, delay = 5000) => {
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.length === 0) {
        console.error(`Attempt ${attempt}: Fetched data is an empty array, retrying...`);
        lastError = new Error('Fetched data is an empty array');
      } else {
        console.log(data); // Data fetched successfully and is not an empty array
        return;
      }
    } catch (error) {
      console.error(`Attempt ${attempt}: Error fetching data`, error.message);
      lastError = error;

      // If the error is not a 504 (Gateway Timeout), break and don't retry
      if (!error.message.includes('504')) break;
    }

    // Waiting for a specified delay before retrying
    if (attempt < retries) {
      console.log(`Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError; // After all attempts, if a satisfactory response is not fetched, throw the last encountered error
};

fetchDataWithRetry(url)
  .then(() => console.log('Data fetch successful'))
  .catch(error => console.error('Final error after retries:', error.message));
