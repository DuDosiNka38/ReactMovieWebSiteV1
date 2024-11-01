const { ipcMain } = require('electron');
const async = require("async");
const store = require("../store");
const MainActions = require("../store/main/actions");
const { writeToConsole } = require('../lib/functions');

ipcMain.on("previewModal", (event, args) => {
  writeToConsole(args)
});