const { exec } = require('child_process');
const { ipcMain, dialog, BrowserWindow } = require('electron');
var fs = require('fs');
const path = require('path');
const publicIp = require('public-ip');
const axios = require("../lib/axios");
var { convertBytesToNormal, getDirInfo, mapStep, writeToConsole } = require('../lib/functions');

ipcMain.on("select-dirs", async (event, arg = {}) => {
  const props = {
    properties: ["openDirectory"],
  };

  if(arg.hasOwnProperty("multi") && arg.multi === true)
    props.properties.push('multiSelections');

  if(arg.hasOwnProperty("defaultPath")){
    props.defaultPath = arg.defaultPath
  }

  const result = await dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), props);
  event.sender.send("select-dirs", result);
  event.returnValue = result;
});

ipcMain.on("select-sync-dirs", async (event, arg) => {
  const props = {
    properties: arg.props,
  };

  if(arg.hasOwnProperty("defaultPath")){
    props.defaultPath = arg.defaultPath
  }

  event.returnValue = await dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), props);  
});

ipcMain.on("getFolderInfo", async (event, args) => {
  let info = null;
  const { path, formatsArr } = args;

  console.log({formatsArr})

  const stat = fs.statSync(path);
  if(stat.isDirectory()){      
    info = await getDirInfo(path, (stat, info) => {
      return formatsArr.includes(info.extname.toLowerCase());
    });
    
    event.returnValue = {path: path, size: info.size, length: info.countFiles};
  }

  event.returnValue = null;
});

ipcMain.on("getFileInfo", async (event, args) => {
  const response = [];
  let info = null;
  const { path } = args;

  const stat = fs.statSync(path);
  if(stat.isFile()){
    event.returnValue = {path, size: stat.size};
  }

  event.returnValue = null;
});

ipcMain.on("openFile", async (event, arg) => {
  const { path } = arg;
  if(fs.existsSync(path)){
    exec(`xdg-open '${path}'`);
  }
});