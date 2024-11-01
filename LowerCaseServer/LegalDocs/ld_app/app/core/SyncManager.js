const store = require('./../store');
const MainActions = require('./../store/main/actions');
const { BrowserWindow } = require('electron');
const axios = require("./../lib/axios");
const { writeToSyncLog } = require('../lib/functions');

const dispatch = (props) => store.dispatch(props);

module.exports = {
  isBlocked: () => {
    const MAIN_STATE = store.getState().Main;
    return MAIN_STATE.Sync.isBlocked || false;
  },

  setBlocked: (blocked) => {
    dispatch(MainActions.setIsBlockedSync(blocked))
  },

  isUploadConfirmed: () => {
    const MAIN_STATE = store.getState().Main;
    return MAIN_STATE.Sync.isUploadConfirmed;
  },

  setUploadConfirmed: (blocked) => {
    dispatch(MainActions.setIsUploadConfirmed(blocked))
  },
};

module.exports.addFileLocation = (file) => {
  BrowserWindow.fromId(1).webContents.send("onAdd", {type: "File_Locations"});
  dispatch(MainActions.addFileLocation(file));
}

module.exports.addRegisteredFile = () => {
  BrowserWindow.fromId(1).webContents.send("onAdd", {type: "Registered_Locations"});
  dispatch(MainActions.addRegisteredFile());
}

module.exports.addNewFile = (file) => {
  dispatch(MainActions.addNewFile(file));
}

module.exports.addNewVersion = (file) => {
  BrowserWindow.fromId(1).webContents.send("onAdd", {type: "New_Versions"});
  dispatch(MainActions.addNewVersion(file));
}

module.exports.addScannedFolder = (dir) => {
  BrowserWindow.fromId(1).webContents.send("onAdd", {type: "Scanned_Folders"});
  writeToSyncLog(`Scanning ${dir}...`)
  dispatch(MainActions.addScannedFolder(dir));
}

module.exports.removeLocation = (file) => {
  BrowserWindow.fromId(1).webContents.send("onAdd", {type: "Remove_Locations"});
  dispatch(MainActions.removeLocation(file));
}

module.exports.increaseScannedFolders = () => {
  dispatch(MainActions.increaseScannedFolders());
}

module.exports.increaseScannedFiles = (file) => {
  if(file) BrowserWindow.fromId(1).webContents.send("onAdd", {type: "Total_Scanned_Files_Size", size: file.File_size});
  if(file) BrowserWindow.fromId(1).webContents.send("onAdd", {type: "Scanned_Files"});
  dispatch(MainActions.increaseScannedFiles(file));
}

module.exports.increaseNewFiles = () => {
  dispatch(MainActions.increaseNewFiles());
}

module.exports.increaseNewFilesSize = (size) => {
  BrowserWindow.fromId(1).webContents.send("onAdd", {type: "New_Files_Size", size});
  dispatch(MainActions.increaseNewFilesSize(size));
}

module.exports.deepScan = function* (dir) {
  const list = fs.readdirSync(dir);
  let file = null;
  let stat = null;

  function* takeItem(arr, dir) {
    for (let i = 0; i < arr.length; i++) {
      file = dir + "/" + arr[i];
      stat = fs.statSync(file);

      if (stat && stat.isDirectory()) {
        /* Recurse into a subdirectory */
        module.exports.increaseScannedFolders();
        module.exports.addScannedFolder(file);
        
        for (const v of module.exports.deepScan(file)) {
          yield v;
        }
      } else {
        /* Is a file */
        yield {File_path: file, stat: stat};
      }
    }
  }

  for (const v of takeItem(list, dir)) {
    yield v;
  }
};

module.exports.getSyncState = () => {
  const MAIN_STATE = store.getState().Main;
  return MAIN_STATE.Sync;
}

module.exports.getNewFiles = () => {
  const MAIN_STATE = store.getState().Main;
  return MAIN_STATE.Sync.New_Files;
}

module.exports.getAddLocations = () => {
  const MAIN_STATE = store.getState().Main;
  return MAIN_STATE.Sync.Add_Locations;
}

module.exports.getNewLocations = () => {
  const MAIN_STATE = store.getState().Main;
  return MAIN_STATE.Sync.New_Locations;
}

module.exports.isSetFilePath = (path) => {
  const FileLocs = [...module.exports.getAddLocations()];
  return Boolean(FileLocs.find((x) => x.File_path === path))
}

module.exports.isSetFileHash = (hash) => {
  const FileLocs = [...module.exports.getAddLocations()];
  return Boolean(FileLocs.find((x) => x.hash === hash));
}

module.exports.setDefaultSyncState = () => {
  dispatch(MainActions.setDefaultSyncState());
}
