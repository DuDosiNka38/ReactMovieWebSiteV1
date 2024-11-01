var http = require("http");
var fs = require("fs");
const pathinfo = require("pathinfo");
const md5File = require("md5-file");
const { Notification, BrowserWindow } = require("electron");
const electron = require("electron");
const app = electron.app;

const APP_DATA_FOLDER = app.getPath("userData");

console.log("App folder", APP_DATA_FOLDER);

module.exports = {

  getFileHash: function (path) {
    return md5File.sync(path);
  },

  convertBytesToNormal: function (bytes) {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

    if (bytes !== 0) {
      const i = parseInt(Math.floor(Math.log(Math.abs(bytes)) / Math.log(1024)), 10);
      if (i === 0) return `${bytes} ${sizes[i]}`;
      return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
    } else {
      return 0;
    }
  },

  convertBytesToMB: function (bytes) {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

    if (bytes !== 0) {
      const i = 2;
      if (i === 0) return `${bytes} ${sizes[i]}`;
      return (bytes / 1024 ** i).toFixed(1);
    } else {
      return 0;
    }
  },

  showNotification: function (title, body) {
    new Notification({ title: title, body: body }).show();
  },

  getCurrentTimestamp: function () {
    return Math.ceil(Date.now() / 1000);
  },

  getCurrentTimestampMS: function () {
    return Date.now();
  },

  writeToConsole: (...args) => {
    BrowserWindow.fromId(1).webContents.send("writeToConsole", args);
  },

  writeToSyncLog: (message) => {
    // module.exports.writeToConsole(message);
    BrowserWindow.fromId(1).webContents.send("onSyncLog", message);
  },

  mapStep: async (data, cbSuccess, cbEnd, i, total) => {
    if (i === null || i === undefined) i = 0;
  
    if (total === null || total === undefined) total = data.length;
  
    if (cbSuccess !== null && cbSuccess !== undefined) {
      await cbSuccess(data[i], async (index) => {
        i = index || ++i;
        if (i < total) {
          await module.exports.mapStep(data, cbSuccess, cbEnd, i, total);
        } else {
          if (cbEnd !== null && cbEnd !== undefined) cbEnd();
        }
      }, i, data);
    }
  },

  mapParted: async (data, partSize, cbSuccess, cbEnd, i, total) => {
    if (i === null || i === undefined) i = 0;

    if (partSize === null || partSize === undefined) partSize = 100;

    if (total === null || total === undefined) total = Math.ceil(data.length / partSize);

    if (cbSuccess !== null && cbSuccess !== undefined) cbSuccess(data.slice(i * partSize, i * partSize + partSize));

    if (++i < total) {
      await module.exports.mapParted(data, partSize, cbSuccess, cbEnd, i, total);
    } else {
      if (cbEnd !== null && cbEnd !== undefined) cbEnd();
    }
  },
  mapPartedStep: async (data, partSize, cbSuccess, cbEnd, i, total) => {
    if (i === null || i === undefined) i = 0;

    if (partSize === null || partSize === undefined) partSize = 100;

    if (total === null || total === undefined) total = Math.ceil(data.length / partSize);

    if (cbSuccess !== null && cbSuccess !== undefined) {
      cbSuccess(data.slice(i * partSize, i * partSize + partSize), () => {
        if (++i < total) {
          module.exports.mapPartedStep(data, partSize, cbSuccess, cbEnd, i, total);
        } else {
          if (cbEnd !== null && cbEnd !== undefined) cbEnd();
        }
      });
    }
  },
  mapRecursive: async (data, cbSuccess, cbEnd, i, total) => {
    if (i === null || i === undefined) i = 0;

    if (total === null || total === undefined) total = data.length;

    if (cbSuccess !== null && cbSuccess !== undefined) cbSuccess(data[i]);

    if (++i < total) {
      module.exports.mapRecursive(data, cbSuccess, cbEnd, i, total);
    } else {
      if (cbEnd !== null && cbEnd !== undefined) cbEnd();
    }
  },
  // mapStep: async (data, cbSuccess, cbEnd, i, total) => {
  //   if (i === null || i === undefined) i = 0;

  //   if (total === null || total === undefined) total = data.length;

  //   if (cbSuccess !== null && cbSuccess !== undefined) {
  //     cbSuccess(data[i], () => {
  //       if (++i < total) {
  //         module.exports.mapStep(data, cbSuccess, cbEnd, i, total);
  //       } else {
  //         if (cbEnd !== null && cbEnd !== undefined) cbEnd();
  //       }
  //     });
  //   }
  // },
};

module.exports.getDirFilesStat = function* (dir, filter) {
  const list = fs.readdirSync(dir);
  let file = null;
  let stat = null;

  function* takeItem(arr, dir) {
    for (let i = 0; i < arr.length; i++) {
      file = dir + "/" + arr[i];
      info = pathinfo(file);
      stat = fs.statSync(file);

      if (stat && stat.isDirectory()) {
        /* Recurse into a subdirectory */        
        for (const v of module.exports.getDirFilesStat(file, filter)) {
          yield v;
        }
      } else {
        if(filter === undefined || filter(stat, info))
          yield {stat, info};
      }
    }
  }

  for (const v of takeItem(list, dir)) {
    yield v;
  }
};

module.exports.getDirInfo = async function(dir, filter) {
  let size = 0;
  let countFiles = 0;

  for await ( let file of module.exports.getDirFilesStat(dir, filter)){
    if(filter === undefined || filter(file.stat, file.info)){
      size += file.stat.size;
      countFiles += 1;
    }
  }

  return {size, countFiles};
};

