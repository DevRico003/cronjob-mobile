// Using ES6 import instead of require
import fetch from 'node-fetch';

// URL to send the GET request to
const url = 'https://www.carcenter-erding.de/api/mobile';

// Function to execute the GET request with retry logic
const fetchDataWithRetry = async (url, retries = 99, delay = 5000) => {
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Sending the GET request
      const response = await fetch(url);

      // Checking if the request was successful
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parsing the response as JSON
      const data = await response.json();

      // Outputting the data
      console.log(data);
      return; // Successfully fetched data, exit function
    } catch (error) {
      console.error(`Attempt ${attempt}: Error fetching data`, error.message);
      lastError = error;

      // If the error is not a 504 (Gateway Timeout), break and don't retry
      if (!error.message.includes('504')) break;

      // Waiting for a specified delay before retrying
      if (attempt < retries) {
        console.log(`Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // After all attempts, if data is still not fetched, throw the last encountered error
  throw lastError;
};

// Invoking the function
fetchDataWithRetry(url)
  .then(() => console.log('Data fetch successful'))
  .catch(error => console.error('Final error after retries:', error.message));
