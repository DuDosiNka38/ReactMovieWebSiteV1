const _axios = require("axios");
const axiosRetry = require("axios-retry");
const axios = _axios.create();
const publicIp = require('public-ip');
const { writeToConsole } = require("./functions");

const retryDelay = (retryNumber = 0) => {
  const seconds = Math.pow(2, retryNumber) * 1000;
  const randomMs = 1000 * Math.random();
  return seconds + randomMs;
};
// axiosRetry(axios, {
//   retries: 3,
//   retryDelay,
//   retryCondition: axiosRetry.isRetryableError,
// });

_axios.interceptors.request.use(
  async function (config) {
    config.headers.user_ip = await publicIp.v4();
    writeToConsole("Request", config);
    // await _axios.get("https://geolocation-db.com/json/")
    //   .then((r) => {
    //     config.headers.user_ip = r.data.IPv4;
    //   })
    //   .catch((e) => (e));

    return config;
  },
  null,
  { synchronous: true }
);

_axios.interceptors.response.use(
  async function (data) {
    writeToConsole("Response", data);
    // await _axios.get("https://geolocation-db.com/json/")
    //   .then((r) => {
    //     config.headers.user_ip = r.data.IPv4;
    //   })
    //   .catch((e) => (e));
    return data;
  },
  null,
  { synchronous: true }
);

module.exports = _axios;
