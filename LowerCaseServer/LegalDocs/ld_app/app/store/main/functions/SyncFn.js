const { BrowserWindow } = require("electron");
const { getCurrentTimestamp, writeToConsole } = require("../../../lib/functions");

module.exports.addFileLoc = (state, action) => {
  const FileLocs = [...state.Sync.Add_Locations];
  const file = action.payload;
  
  const fileInd = FileLocs.findIndex((x) => x.hash === file.File_id);
  if (fileInd !== -1) {
    if(FileLocs[fileInd].File_locations.find((x) => x.File_path === file.File_path) === undefined){
      FileLocs[fileInd].File_locations.push({File_path: file.File_path, File_name: file.File_name,
        File_dir: file.File_dir, isNew: file.isNew || false});

      if(file.isNew){
        FileLocs[fileInd].isHasNew = true;
      }
    }
  } else {
    FileLocs.push(file);
  }

  return {
    ...state,
    Sync: {
      ...state.Sync,
      Add_Locations: FileLocs
    }
  }
}
module.exports.addRegisteredLoc = (state, action) => {
  return {
    ...state,
    Sync: {
      ...state.Sync,
      Registered_Locations: state.Registered_Locations+1
    }
  }
}

module.exports.addNewFile = (state, action) => {
  const New_Files = [...state.Sync.New_Files];
  let {Start_Scan_Timestamp} = state.Sync;
  let New_Files_Max_Size = state.Sync.New_Files_Max_Size;
  let New_Files_Min_Size = state.Sync.New_Files_Min_Size;
  let Total_New_Files_Size = state.Sync.Total_New_Files_Size;
  let Total_New_Files = state.Sync.Total_New_Files;
  let Duplicate_Files = state.Sync.Duplicate_Files;

  if(Start_Scan_Timestamp === null) Start_Scan_Timestamp = getCurrentTimestamp();

  const file = action.payload;
  
  const fileInd = New_Files.findIndex((x) => x.File_id === file.File_id);
  if (fileInd !== -1) {
    if(New_Files[fileInd].File_locations === undefined || New_Files[fileInd].File_locations === null){
      New_Files[fileInd].File_locations = [];
    }

    if(New_Files[fileInd].File_path !== file.File_path){
      New_Files[fileInd].File_locations.push({File_path: file.File_path, File_name: file.File_name,
        File_dir: file.File_dir});
      Duplicate_Files += 1;
      BrowserWindow.fromId(1).webContents.send("onAdd", {type: "Duplicate_Files"});
    }
  } else {
    if(file){
      const FILE_SIZE = parseInt(file.File_size);
      Total_New_Files_Size += FILE_SIZE;
      Total_New_Files += 1;
      New_Files_Max_Size = New_Files_Max_Size < FILE_SIZE ? FILE_SIZE : New_Files_Max_Size;
      New_Files_Min_Size = ( New_Files_Min_Size > FILE_SIZE || New_Files_Min_Size === 0 ) ? FILE_SIZE : New_Files_Min_Size;

      const scanSpeed = parseInt(Total_New_Files_Size)/(getCurrentTimestamp() - Start_Scan_Timestamp);

      BrowserWindow.fromId(1).webContents.send("onAdd", {type: "New_Files_Size", size: FILE_SIZE});
      BrowserWindow.fromId(1).webContents.send("onAdd", {type: "Scan_Speed", scanSpeed});
      BrowserWindow.fromId(1).webContents.send("onAdd", {type: "New_Files"});

      New_Files.push(file);  
    }
  }

  return {
    ...state,
    Sync: {
      ...state.Sync,
      New_Files:New_Files,
      Total_New_Files: Total_New_Files,
      Total_New_Files_Size: Total_New_Files_Size,
      New_Files_Max_Size: New_Files_Max_Size,
      New_Files_Min_Size: New_Files_Min_Size,
      Start_Scan_Timestamp,
      Duplicate_Files
    }
  }
}

module.exports.addNewVer = (state, action) => {
  const New_Versions = [...state.Sync.New_Versions];
  const file = action.payload;

  const fileInd = New_Versions.findIndex((x) => x.newHash === file.newHash);
  if (fileInd !== -1) {
    if(New_Versions[fileInd].File_locations.find((x) => x.File_path === file.File_path) === undefined){
      New_Versions[fileInd].File_locations.push(file);
    }
  } else {
    New_Versions.push(file);
  } 

  return {
    ...state,
    Sync: {
      ...state.Sync,
      New_Versions
    }
  }
}

module.exports.addScannedFolder = (state, action) => {
  const Scanned_Folders = [...state.Sync.Scanned_Folders];
  const dir = action.payload;

  if(!Scanned_Folders.includes(dir))
    Scanned_Folders.push(dir);

  return {
    ...state,
    Sync: {
      ...state.Sync,
      Scanned_Folders: Scanned_Folders
    }
  }
}

module.exports.removeLocation = (state, action) => {
  return {
    ...state,
    Sync: {
      ...state.Sync,
      Remove_Locations: [...state.Sync.Remove_Locations, action.payload]
    }
  }
}

module.exports.increaseScannedFolders = (state, action) => {
  return {
    ...state,
    Sync: {
      ...state.Sync,
      Total_Scanned_Folders: state.Sync.Total_Scanned_Folders+1
    }
  }
}

module.exports.increaseScannedFiles = (state, action) => {
  let Total_Scanned_Files_Size = state.Sync.Total_Scanned_Files_Size;

  if(action.payload){
    Total_Scanned_Files_Size += parseInt(action.payload.File_size);
  }
  
  return {
    ...state,
    Sync: {
      ...state.Sync,
      Total_Scanned_Files: state.Sync.Total_Scanned_Files+1,
      Total_Scanned_Files_Size
    }
  }
}

module.exports.increaseNewFiles = (state, action) => {
  return {
    ...state,
    Sync: {
      ...state.Sync,
      Total_New_Files: state.Sync.Total_New_Files+1
    }
  }
}

module.exports.increaseNewFilesSize = (state, action) => {
  const MAX_FILE_SIZE = state.Sync.New_Files_Max_Size;
  const MIN_FILE_SIZE = state.Sync.New_Files_Min_Size;
  const FILE_SIZE = parseInt(action.payload);
  return {
    ...state,
    Sync: {
      ...state.Sync,
      Total_New_Files_Size: state.Sync.Total_New_Files_Size+FILE_SIZE,
      New_Files_Max_Size: MAX_FILE_SIZE < FILE_SIZE ? FILE_SIZE : MAX_FILE_SIZE,
      New_Files_Min_Size: ( MIN_FILE_SIZE > FILE_SIZE || MIN_FILE_SIZE === 0 ) ? FILE_SIZE : MIN_FILE_SIZE,
    }
  }
}