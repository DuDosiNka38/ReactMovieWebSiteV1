const { ipcRenderer } = require("electron");

let timeOut = null;

const openFolder = (path) => {
    ipcRenderer.send("showFileInFolder", {
      path: path,
    });
  }

const openFile = (path) => {
    ipcRenderer.send("openFile", {
        path: path,
    });
}

const convertBytesToNormal = (bytes) => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  
  if (bytes !== 0) {
      const i = parseInt(
      Math.floor(Math.log(Math.abs(bytes)) / Math.log(1024)),
      10
      );
      if (i === 0) return `${bytes} ${sizes[i]}`;
      return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
  } else {
      return 0;
  }
}

const countDays = (startStr, endStr) => {
  console.log(startStr, endStr)
  return Math.abs((Date.parse(endStr) - Date.parse(startStr)) / (60 * 60 * 24 * 1000));
}

const countWorkDays = (startStr, endStr) => {
  const weekends = [0, 6];
  const DAY = 60 * 60 * 24 * 1000;
  const numDays = countDays(startStr, endStr);
  const startDate = Date.parse(startStr);
  let WORK = 0;

  for (let i = 0; i < numDays; ++i) {
    let curDay = startDate + i * DAY;
    let utcDay = new Date(curDay).getDay();

    if (!weekends.includes(utcDay)) WORK += 1;
  }

  return WORK;
}

const removeCountDown = () => {
  clearTimeout(timeOut);
}
  
const countDown = (sec, cbSuccess, cbEnd) => {
  if (sec > 0) {
    sec--;
    cbSuccess(sec);
    timeOut = setTimeout(() => countDown(sec, cbSuccess, cbEnd), 1000);
  } else {
    cbEnd();
  }
};

const secToNormal = (sec) => {
  let min = sec > 0 ? parseInt(sec/60) : 0;
  let hours = sec > 0 ? parseInt(min/60) : 0;

  if(hours > 0)
    min = Math.ceil(min - hours*60);
    
  if(min > 0)
    sec = Math.ceil(sec - (hours*60*60+min*60));
  else
    sec = Math.ceil(sec - hours*60*60)
      

  return `${hours !== 0 ? hours+"h " : ""}${min === 0 && hours === 0 ? "" : min+"m "}${sec}s`;
}

const getSecondsToday = () => {
  let d = new Date();
  return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
}

const isEmptyObj = (obj) => {
  return Object.keys(obj).length === 0;
}

export default {openFile, openFolder, convertBytesToNormal, countDays, countWorkDays, countDown, secToNormal, getSecondsToday, removeCountDown, isEmptyObj};