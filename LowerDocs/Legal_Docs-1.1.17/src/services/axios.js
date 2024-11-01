
// import axiosRetry from "axios-retry";
const _axios = require('axios') 
const axiosRetry = require('axios-retry') 
const axios = _axios.create() 
const retryDelay = (retryNumber = 0) => { 
  const seconds = Math.pow(2, retryNumber) * 1000; 
  const randomMs = 1000 * Math.random(); 
  return seconds + randomMs; 
}
axiosRetry(axios, { 
  retries: 3, 
  retryDelay, 
  // retry on Network Error & 5xx responses 
  retryCondition: axiosRetry.isRetryableError, 
}); 

export default axios;