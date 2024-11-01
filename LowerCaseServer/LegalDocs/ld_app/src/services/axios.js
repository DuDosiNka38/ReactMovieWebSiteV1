import { ipcRenderer } from "electron";
import AuthService from "./AuthService";
import SystemService from "./SystemService";

const _axios = require("axios");
const axiosRetry = require("axios-retry");
const axios = _axios.create();
const dayjs = require("dayjs");
const qs = require('qs');
const publicIp = require('public-ip');

let IP = null;

const GetIp = async () => {
  if (IP === null) {
    const response = await fetch("https://geolocation-db.com/json/", { method: "GET", mode: "cors" })
      .then((r) => r.json())
      .catch((e) => e.json);
    IP = response.IPv4;
  }
  return IP;
};

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

axios.interceptors.request.use(
  async function (config) {
    const token = AuthService.getAuthHash();

    if (token !== null) config.headers.user_auth_hash = token;

    config.headers.user_ip = await publicIp.v4();//await GetIp();
    return config;
  },
  null,
  { synchronous: true }
);

axios.interceptors.request.use((config) => {
  config.paramsSerializer = (params) => qs.stringify(params, {
    serializeDate: (date) => dayjs(date).format('YYYY-MM-DDTHH:mm:ssZ') });
  return config;
})

axios.interceptors.response.use(
  function (response) {
    if(response.data.hasOwnProperty("result") && response.data.hasOwnProperty("data") && response.data.data.hasOwnProperty("error_code")){
      if(!response.data.result && response.data.data.error_code === "WRONG_SESSION"){
        setTimeout(AuthService.removeAuthHash, 1000);
      }
    }
    return response;
  },
  function (error) {
    if (!error.response) {
      // SystemService.showModal("SERVER_ERROR");
      // alert("Server is down");
      // AuthService.removeAuthHash();
      // ipcRenderer.send("reloadWindow");
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export default axios;
