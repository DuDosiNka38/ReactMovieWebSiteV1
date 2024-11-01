const { ipcMain, dialog, BrowserWindow } = require("electron");
const { SYNC_FILESYSTEM, CONFIRM_UPLOAD, DECLINE_UPLOAD, IS_SYNC_BLOCKED, CHECK_LOCATIONS } = require("../handlers/Sync");

ipcMain.on("SYNC_FILESYSTEM", SYNC_FILESYSTEM);
ipcMain.on("confirmUpload", CONFIRM_UPLOAD);
ipcMain.on("declineUpload", DECLINE_UPLOAD);
ipcMain.on("isSyncBlocked", IS_SYNC_BLOCKED);

ipcMain.on("SYNC/CHECK_LOCATIONS", CHECK_LOCATIONS)
