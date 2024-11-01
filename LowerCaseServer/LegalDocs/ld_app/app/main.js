"use strict";

const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const path = require("path");
const url = require("url");
const isDev = require("electron-is-dev");
const HostManager = require("./core/HostManager");
const axios = require("./lib/axios");
const store = require("./store");
const fs = require('fs');
const { writeToConsole } = require("./lib/functions");
const { existsSync } = require("fs");
require("./listeners/");

let mainWindow;

let modals = [];

if (process.platform === "win32") {
  app.commandLine.appendSwitch("high-dpi-support", "true");
  app.commandLine.appendSwitch("force-device-scale-factor", "1");
}

async function loadData(mainWindow){

  await HostManager.removeOldHosts();
  const hostData = await HostManager.getActiveHost();

  axios.defaults.baseURL = hostData ? hostData.host : null;

  let indexPath;

  if (isDev) {
    indexPath = 'http://localhost:3000';
    // indexPath = url.format({
    //   protocol: "http:",
    //   host: "localhost:3000",
    //   pathname: "index.html",
    //   slashes: true,
    // });
  } else {
    indexPath = `file://${path.join(__dirname, '../build/index.html')}`;
    // indexPath = url.format({
    //   protocol: "file:",
    //   pathname: path.join(__dirname, "../", "build", "index.html"),
    //   slashes: true,
    // });
  }
  mainWindow.loadURL(indexPath);
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    show: true,
    autoHideMenuBar: true,
    nodeIntegrationInWorker: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  await loadData(mainWindow);

  mainWindow.maximize();
  mainWindow.webContents.openDevTools();

  mainWindow.webContents.on("did-finish-load", () => {
    try{
      const name = require("../package.json").name;
      const version = require("../package.json").version;
      const Title = name.replace(new RegExp("_", "g"), " ") + " " + version;
      mainWindow.setTitle(Title);
    } catch(e) {

    }
    
  });

  mainWindow.on("closed", function () {
    mainWindow = null;
  });  
}

async function createModalWindow(
  {width, height, fullscreen, minimizable, maximizable, fullScreenable,resizable, file, title, openPath} = 
  {width: 1024, height: 768, minimizable: true, maximizable: true,fullScreenable: true,resizable: true,}) {
  // const filePath = ;

  // if(!existsSync(filePath))
  //   return;

  let modalWindow = new BrowserWindow({
    width,
    height,
    show: true,
    resizable,
    fullScreenable,
    minimizable,
    maximizable,
    autoHideMenuBar: true,
    nodeIntegrationInWorker: true,
    isModal: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });


  modalWindow.loadURL(path.join('http://localhost:3000', openPath));

  if(fullscreen){
    modalWindow.maximize();
  }
  modalWindow.webContents.openDevTools();
 
  modalWindow.webContents.on("did-finish-load", () => {
    if(title)
      modalWindow.setTitle(title);
  });

  ipcMain.on("closeModal", (event, args) => {
    modalWindow.close();
  });

  modalWindow.on("closed", function () {
    modalWindow = null;
  });  
}

ipcMain.on("openModal", (event, args) => {
  createModalWindow(args);
});

ipcMain.on("reloadWindow", (event, args) => {
  // mainWindow.reload();
  loadData(BrowserWindow.fromId(1));
  // loadData();
});

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
