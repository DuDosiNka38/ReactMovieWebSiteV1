const electron = require("electron");
const async = require("async");
const si = require("systeminformation");
const path = require("path");
const isDev = require("electron-is-dev");
const Core = require("./core");
const { shell, Notification } = electron;

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const { dialog, ipcMain, Menu } = require("electron");
var http = require("http");
var fs = require("fs");
const { exec } = require("child_process");
const zip = require("node-zip")();
const pathinfo = require("pathinfo");
const { writeFile } = fs.promises;
const axios = require("axios");
const FormData = require('form-data');
const md5File = require('md5-file');
const md5Dir = require('md5-dir');
const { func } = require("prop-types");

let BLOCK_SYNC = false;
let BREAK_SCAN = false;

let SERVER = null;

const sysInfo = {
  users: null,
  os: null,
  uuid: null,
  network: null,
};

let mainWindow;
let userHash = null;

function writeToConsole() {
  if (arguments.length === 1)
    mainWindow.webContents.send("writeToConsole", { data: arguments[0] });
  else mainWindow.webContents.send("writeToConsole", { data: arguments });
}

function isHostExists(){
  const config = Core.getConfig();

  return ("host" in config && config.host !== "");
}

function getHostsList(){
  const config = Core.getConfig();
  const hostsList = ("hostsList" in config && config.hostsList !== "") ? config.hostsList : [];

  return hostsList;
}

function addHostToList(host, alias){
  let hostsList = getHostsList();
  hostsList.push({
    host: host,
    alias: alias
  });

  Core.setConfig({hostsList: hostsList});

  return hostsList;
}

function deleteHostFromList(host){
  let hostsList = getHostsList();

  Core.setConfig({hostsList: hostsList.filter((x) => x.host !== host)});
}

function getHost(){
  const config = Core.getConfig();
  const hostsList = getHostsList();
  const host = config.host !== null && config.host !== undefined ? config.host : "";

  if(host !== "" && hostsList.find((x) => x.host === host) === undefined){
    addHostToList(host);
  }

  return host;
}

function loadData(){
  const isConfigSet = isHostExists();

  if(isConfigSet){
    axios.defaults.baseURL = getHost();
    SERVER = getHost();
  }

  let loadPath = null;

  if(isDev){
    if(isConfigSet){
      loadPath = "http://localhost:3000";
    } else {
      loadPath = `file://${path.join(__dirname, "../public/firstStart.html")}`;
    }
  } else {
    if(isConfigSet){
      loadPath = `file://${path.join(__dirname, "../build/index.html")}`;
    } else {
      loadPath = `file://${path.join(__dirname, "../build/firstStart.html")}`;
    }
  }

  mainWindow.loadURL(loadPath);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    autoHideMenuBar: true,
    nodeIntegrationInWorker: true,
    // frame: false,
    show: true,
    icon: path.join(__dirname, "../build/icons/icon.icns"),
  });

  Core.isAppDataFolderExists();

  loadData();
  
  if (isDev) {
  mainWindow.webContents.openDevTools();
  }
  mainWindow.maximize();
  mainWindow.on("closed", () => (mainWindow = null));

  mainWindow.webContents.on("did-finish-load", () => {
    const name = require("../package.json").name;
    const version = require("../package.json").version;
    const Title = name.replace(new RegExp("_", "g"), " ") + " " + version;
    mainWindow.setTitle(Title);
    writeToConsole({ Status: "App loaded" });
    // writeToConsole({MD5: md5Dir.sync('/home/tony/Desktop/TEST')});
  });
}

function showNotification(title, body){
  new Notification({ title: title, body: body }).show();
}

ipcMain.on("ADD_HOST", (event, args) => {
  const { host, alias } = args;
  event.sender.send("ADD_HOST", {result: true});
  event.sender.send("GET_HOSTS_LIST", {hostsList: addHostToList(host, alias)});
});

//IN DEVELOPMENT
ipcMain.on("REMOVE_HOST", (event, args) => {
  const hostsList = getHostsList();
  const host  = getHost();
  
  const filteredHostsList = hostsList.filter((x) => x.host !== host);
  const newHost = filteredHostsList.length > 0 ? filteredHostsList[0].host : "";

  const config = {
    host: newHost,
    hostsList: filteredHostsList
  };
  
  // event.sender.send("GET_HOSTS_LIST", {hostsList: Core.setConfig(config).hostsList});
  // event.sender.send("REMOVE_HOST", {});
  // setTimeout(loadData, 2000);
});

ipcMain.on("SET_APPLICATION_SERVER", (event, args) => {
  const { host } = args;
  
  const config = Core.setConfig({host: host});
  event.sender.send("SET_APPLICATION_SERVER", {config: config});

  setTimeout(loadData, 2000);
});

ipcMain.on("GET_HOST", (event, args) => {
  event.sender.send("GET_HOST", {host: getHost()});
});

ipcMain.on("GET_HOSTS_LIST", (event, args) => {
  event.sender.send("GET_HOSTS_LIST", {hostsList: getHostsList()});
});

ipcMain.on("openFile", async (event, arg) => {
  const { hash, appDir, path } = arg;
  if (path === undefined || path === null) {
    const checkHash = Core.checkFileHash(hash, appDir);
    if (checkHash !== true) exec(`xdg-open '${checkHash[0]}'`);
  } else {
    exec(`xdg-open '${path}'`);
  }
});
ipcMain.on("removeFile", async (event, arg) => {
  const { hash, appDir, path } = arg;
  try {
    fs.unlinkSync(path);
    setTimeout(() => event.sender.send("removeFile", { result: true }), 1000);
  } catch (error) {
    console.error(error);
    setTimeout(
      () => event.sender.send("removeFile", { result: false, error: error }),
      1000
    );
  }
});
ipcMain.on("showFileInFolder", (event, args) => {
  const { path } = args;
  shell.showItemInFolder(path);
});
ipcMain.on("openFolder", (event, args) => {
  const { path } = args;
  shell.openItem(path);
});
ipcMain.on("downloadFile", async (event, arg) => {
  const { appDir, fileDir, fileName, filePath, hash, params } = arg;
  const targetDir = appDir + fileDir;
  const pathToFile = targetDir + "/" + fileName;
  const checkFileHash =
    params.checkHash !== undefined && params.checkHash === true
      ? Core.checkFileHash(hash, appDir)
      : true;
  const E = event.sender;

  const rewrite =
    params !== undefined && params.hasOwnProperty("rewrite")
      ? params.rewrite
      : false;

  if (rewrite === true) {
    try {
      await fs.unlinkSync(pathToFile);
    } catch (error) {
      console.error(error);
    }
  }

  if (checkFileHash == true) {
    try {
      await fs.promises.access(targetDir, fs.constants.F_OK);
    } catch (e) {
      await Core.createDir(targetDir);
    }
    try {
      await fs.promises.access(pathToFile, fs.constants.F_OK);
      event.sender.send("downloadFile", {
        result: true,
        message: "FILE_WITH_SAME_NAME_ALREADY_EXISTS",
        path: pathToFile,
        hash: Core.getFileHash(pathToFile),
      });
    } catch (e) {
      if (e.code === "ENOENT") {
        var file = fs.createWriteStream(targetDir + "/" + fileName);
        var request = await http.get(filePath, function (response) {
          response.pipe(file);
        });
        event.sender.send("downloadFile", {
          result: true,
          message: "FILE_SUCCESSFULLY_DOWNLOADED",
          path: pathToFile,
        });
      } else {
        console.log("Catched:", e.message);
      }
    }
  } else {
    event.sender.send("downloadFile", {
      result: true,
      message: "FILE_WITH_HASH_EXISTS",
      path: checkHash,
    });
  }
});
ipcMain.on("checkFile", async (event, arg) => {
  const { appDir, fileName, hash } = arg;
  const checkHash = Core.checkFileHash(hash, appDir);
  event.sender.send("checkFile", { result: true, checkResult: checkHash });
});
ipcMain.on("select-dirs", async (event, arg) => {
  const props = {
    properties: ["openDirectory"],
  };

  if(arg.hasOwnProperty("defaultPath")){
    props.defaultPath = arg.defaultPath
  }

  const result = await dialog.showOpenDialog(mainWindow, props);
  event.sender.send("select-dirs", result);
});
ipcMain.on("select-sync-dirs", async (event, arg) => {
  const props = {
    properties: ["openDirectory"],
  };

  if(arg.hasOwnProperty("defaultPath")){
    props.defaultPath = arg.defaultPath
  }

  const result = await dialog.showOpenDialog(mainWindow, props);
  event.sender.send("select-sync-dirs", result);
});
ipcMain.on("getSysInfo", (event, args) => {
  const s = async.series(
    [
      function (callback) {
        if (sysInfo.uuid == null)
          si.uuid()
            .then((x) => (sysInfo.uuid = x))
            .then(() => callback(null, 1));
        else callback(null, 1);
      },
      function (callback) {
        if (sysInfo.os == null)
          si.osInfo()
            .then((x) => (sysInfo.os = x))
            .then(() => callback(null, 1));
        else callback(null, 2);
      },
      function (callback) {
        if (sysInfo.users == null)
          si.users()
            .then((x) => (sysInfo.users = x))
            .then(() => callback(null, 1));
        else callback(null, 3);
      },
      function (callback) {
        if (sysInfo.network == null)
          si.networkInterfaces()
            .then((x) => (sysInfo.network = x))
            .then(() => callback(null, 1));
        else callback(null, 4);
      },
    ],
    function (err, results) {
      event.sender.send("getSysInfo", sysInfo);
    }
  );
});
ipcMain.on("setHash", async (event, args) => {
  userHash = args;
  event.sender.send("setHash", true);
});
ipcMain.on("getHash", (event, args) => {
  event.sender.send("getHash", userHash);
});
ipcMain.on("createZip", (event, args) => {
  const { toZip, saveHierarchy, locToSave, zipName } = args;
  const files = Core.searchFiles(toZip);

  files.forEach((file) => {
    let fileName = file;
    fileName = fileName.replace(`${locToSave}`, "");

    if (saveHierarchy === false || saveHierarchy === "false") {
      const pi = pathinfo(file);
      fileName = pi.filename;
    }

    zip.file(fileName, fs.readFileSync(file));
  });

  const data = zip.generate({ base64: false, compression: "DEFLATE" });
  writeFile(`${locToSave}/${zipName}.zip`, data, "binary").then((r) => {
    fs.access(`${locToSave}/${zipName}.zip`, fs.constants.F_OK, (err) => {
      let ret = true;
      if (err) ret = false;

      event.sender.send("createZip", { result: ret });
    });
  });
});

ipcMain.on("SYNC_FILESYSTEM", async(event, args) => {  

  if(BLOCK_SYNC === false){
    BLOCK_SYNC = true;
    event.sender.send("IS_SYNC_BLOCKED", {isSyncBlocked: BLOCK_SYNC})

    const CoreFunctions = require("./core");

    const serverTime = await axios.get("/api/user/getServerTime").then((r) => (r.data));
    const Timestamp = CoreFunctions.getCurrentTimestamp();
    const TimestampMS = CoreFunctions.getCurrentTimestampMS();

    const { hash, dirs, daySeconds } = args;
    const appData = await axios
      .post("/api/user/get_data", { hash: hash })
      .then((resp) => resp.data);

    const docLocations = await axios
      .get("/api/document/getAllLocations")
      .then((x) => x.data);

    const { Person, Core } = appData;
    const Computer_id = sysInfo.os.hostname;
    const formatsArr = Core.File_Formats.map((x) => `.${x.Format}`);
    const { Settings, Doc_files, Uploaded_files, Sync_Schedule, Syncronization } = Core;
    const MAC = sysInfo.uuid.macs[0];
    const uSettings = Settings.USER[Person.Person_id];
    const uploadedHashes = Uploaded_files.filter((x) => x.Person_id === Person.Person_id && x.Mac_address === MAC).map((x) => (x.File_hash));

    
    if(true){

      event.sender.send("SET_SYNC_DATA", {
        action: "PREPARE_TO_SYNC"
      });
      
      const filesOnServer = Doc_files.map((x) => (x.File_id));
      
      //Get Dirs for scan
      const SYNC_DIRS = dirs;
      //SYNC DATA ARRAYS
      const NEW_VERSION = [];
      const ACTUAL_VERSION = [];
      const ADD_LOCATION = [];
      const REMOVE_LOCATION = [];
      const FILE_LOCATIONS = [];
      const ALREADY_UPLOADED = [];
      const FILES_SIZE = [];

      const SCANNED_FILES = [];

      let MAX_FILE_SIZE = 0;
      let TOTAL_FILES_SIZE = 0;
      let TOTAL_UPLOAD_FILES_SIZE = 0;
      let TOTAL_FILES = 0;
      let TOTAL_SCANNED_DIRS = 0;
      let TOTAL_FILES_SCANNED = 0;

      let SCAN_RESULT = {};

      //Functions
        const pushToFL = (fp, hash, name, isUpl, size, ctime) =>{
          if(typeof fp !== "object" && typeof fp !== "Object"){
            fp = {
              path: fp,
              hash: hash,
              name: name,
              locations: [],
              isUploaded: isUpl,
              size: size,
              CREATED_DATE: ctime
            };
          }

          if(filesOnServer.includes(fp.hash))
            fp.isUploaded = true;
          
          if(fp.isUploaded === false)
            TOTAL_UPLOAD_FILES_SIZE += size;

          FILE_LOCATIONS.push(fp);
        };
        const addFileLoc = (hash, loc, isExistsInDB) => {
          const file = FILE_LOCATIONS.find((x) => x.hash === hash);
          if(file !== undefined){
            if(file.locations.find((y) => y.path === loc) === undefined)
              file.locations.push({path: loc, isExistsInDB: isExistsInDB});
          }
        };
        const isSetFilePath = (loc, cbSuccess, cbError) => {
          try {
            if(FILE_LOCATIONS.find((file) => file.File_path === loc) === undefined){
              if(cbSuccess !== null && cbSuccess !== undefined)
                cbSuccess(false);
              return false;
            } else {
              if(cbSuccess !== null && cbSuccess !== undefined)
                cbSuccess(true);
              return true;
            }
          } catch (e) {
            if(cbError !== null && cbError !== undefined)
              cbError(e.message);
            else
              console.log(e.message);
          }
        };
        const isSetFileHash = (hash, cbSuccess, cbError) => {
          try {
            if(FILE_LOCATIONS.find((file) => file.hash === hash) === undefined){
              if(cbSuccess !== null && cbSuccess !== undefined)
                cbSuccess(false);
              return false;
            } else {
              if(cbSuccess !== null && cbSuccess !== undefined)
                cbSuccess(true);
              return true;
            }
          } catch (e) {
            if(cbError !== null && cbError !== undefined)
              cbError(e.message);
            else
              console.log(e.message);
          }
        };
        const mapParted = async (data, partSize, cbSuccess, cbEnd, i, total) => {
          if(i === null || i === undefined)
            i = 0;

          if(partSize === null || partSize === undefined)
            partSize = 100;

          if(total === null || total === undefined)
            total = Math.ceil(data.length/partSize);

          if(cbSuccess !== null && cbSuccess !== undefined)
            cbSuccess(data.slice((i*partSize), (i*partSize) + partSize));

          if(++i < total) {
            await mapParted(data, partSize, cbSuccess, cbEnd, i, total);
          } else {
            if(cbEnd !== null && cbEnd !== undefined)
              cbEnd();
          }
        };
        const mapPartedStep = async (data, partSize, cbSuccess, cbEnd, i, total) => {
          if(i === null || i === undefined)
            i = 0;

          if(partSize === null || partSize === undefined)
            partSize = 100;

          if(total === null || total === undefined)
            total = Math.ceil(data.length/partSize);

          if(cbSuccess !== null && cbSuccess !== undefined){
            cbSuccess(
              data.slice((i*partSize), (i*partSize) + partSize), 
              () => {
                if(++i < total) {
                  mapPartedStep(data, partSize, cbSuccess, cbEnd, i, total);
                } else {
                  if(cbEnd !== null && cbEnd !== undefined)
                    cbEnd();
                }
              }
            )
          } 
        };
        const mapRecursive = async (data, cbSuccess, cbEnd, i, total) => {
          if(i === null || i === undefined)
          i = 0;

          if(total === null || total === undefined)
            total = data.length;

          if(cbSuccess !== null && cbSuccess !== undefined)
            cbSuccess(data[i]);

          if(++i < total) {
            mapRecursive(data, cbSuccess, cbEnd, i, total);
          } else {
            if(cbEnd !== null && cbEnd !== undefined)
              cbEnd();
          }
        };  
        const mapStep = async (data, cbSuccess, cbEnd, i, total) => {
          if(i === null || i === undefined)
          i = 0;

          if(total === null || total === undefined)
            total = data.length;

          if(cbSuccess !== null && cbSuccess !== undefined){
            cbSuccess(data[i], 
              () => {
                if(++i < total) {
                  mapStep(data, cbSuccess, cbEnd, i, total);
                } else {
                  if(cbEnd !== null && cbEnd !== undefined)
                    cbEnd();
                }
              }
            )
          }              
        };  
        

      try{
        async.waterfall([
          //Check locations
          function (callback){

            if(BREAK_SCAN === true)
              callback("BREAK_SCAN", null);

            event.sender.send("SET_SYNC_DATA", {
              action: "CHECK_LOCATIONS",
              currentLocation: null
            });
            let localDocLocations = [];

            if(docLocations.hasOwnProperty("result") && docLocations.result === false){
              localDocLocations = [];
            } else {
              localDocLocations = docLocations.filter(
                (x) => x.Computer_id === Computer_id && x.removed_dt === null
              );
            }

            writeToConsole(localDocLocations);

            mapStep(localDocLocations, 
              (row, next) => {

                if (row !== undefined && fs.existsSync(row.File_path)) {

                  const stat = fs.statSync(row.File_path);

                  writeToConsole(stat);
  
                  const file = {
                    path: row.File_path,
                    locations: [],
                    hash: row.File_id,
                    name: row.File_name,
                    isUploaded: true,
                    size: stat.size,
                    CREATED_DATE: stat.ctime,
                  };
  
                  event.sender.send("SET_SYNC_DATA", {
                    action: "CHECK_LOCATIONS",
                    currentLocation: row.File_path
                  });

                  if(FILE_LOCATIONS.find((x) => x.hash === row.File_id) === undefined){
                    pushToFL(file);
                  } else {
                    addFileLoc(row.File_id, row.File_path, true);
                  }

                  if(CoreFunctions.getFileHash(row.File_path) !== row.File_id){
                    //
                    //
                    //Add new file version
                    //
                    //
                    NEW_VERSION.push(file);
                  } else {
                    ACTUAL_VERSION.push(file);
                  }
                } else {
                  //Remove location
                  axios.post("/api/file/removeLocation", row).then((r) => {
                    if(r.data.result === true)
                      REMOVE_LOCATION.push(row);
                  });        
                }

                setTimeout(next, 100);
              },
              () => {
                callback(null, 1);
              }
            );  
            
            
          },

          //Scan all folders
          function (arg, callback){

            if(BREAK_SCAN === true)
              callback("BREAK_SCAN", null);

            const TOTAL_DIRS = SYNC_DIRS.length;

            event.sender.send("SET_SYNC_DATA", {
              action: "SCAN_FOLDERS",
              totalDirs: TOTAL_DIRS,
              currentDirIndex: 0,
              filesFound: 0,
              foundFile: null
            });

            writeToConsole({startScanTime: Timestamp})

            let scannedDirs = 1;
            mapStep(SYNC_DIRS, 
              (dir, next) => {

                if(BREAK_SCAN === true)
                  callback("BREAK_SCAN", null);

                if(fs.existsSync(dir)){
                  TOTAL_SCANNED_DIRS += 1;

                  CoreFunctions.searchFiles(dir, (x) => {
                    TOTAL_FILES_SCANNED += 1;
                    SCANNED_FILES.push(x);   
                    event.sender.send("SET_SYNC_DATA", {
                      action: "SCAN_FOLDERS",
                      totalDirs: TOTAL_DIRS,
                      currentDirIndex: 0,
                      filesFound: TOTAL_FILES_SCANNED,
                      foundFile: x
                    })
                  }
                  );
                }

                next();
              },
              () => {    
                writeToConsole({endScanTime: CoreFunctions.getCurrentTimestampMS(), duration: `${(CoreFunctions.getCurrentTimestampMS()-TimestampMS)/1000}s`});          
                callback(null, 2);
              },
              null,
              TOTAL_DIRS
            );             
          },
          
          //Parse scanned files data
          function (arg, callback){ 
            let isCalledBreak = false;

            if(BREAK_SCAN === true){
              callback("BREAK_SCAN", null);
              isCalledBreak = true;
            }

            const startParseTime = CoreFunctions.getCurrentTimestampMS();
            writeToConsole({startParseTime: startParseTime});

            //Divide big array
            let counter = 0;
            let i = 0;

            mapPartedStep(SCANNED_FILES, 10, 
              async (part, nextParted) => {
                await mapStep(part, 
                  (x, next) => {
                    const parseFileTimeStart = CoreFunctions.getCurrentTimestampMS();
                    event.sender.send("SET_SYNC_DATA", {
                      action: "PREPARE_TO_UPLOAD",
                      currentIndex: ++i,
                      totalFiles: TOTAL_FILES_SCANNED,
                      currentFile: x,
                    });

                    const hash = md5File.sync(x);

                    isSetFilePath(x, (isSetPath) => {
                      if(isSetPath === false){
                        isSetFileHash(x, (isSetHash) => {
                          if(isSetHash === true){
                            addFileLoc(hash, x, false);
                          } 
                          else {
                            const info = pathinfo(x);
            
                            if(formatsArr.includes(info.extname) === true){
                              const stat = fs.statSync(x);
                              TOTAL_FILES += 1;
                              TOTAL_FILES_SIZE += stat.size;
                              MAX_FILE_SIZE = MAX_FILE_SIZE < stat.size ? stat.size : MAX_FILE_SIZE;
            
                              pushToFL(x, hash, info.filename, uploadedHashes.includes(hash) ? true : false, stat.size, stat.ctime);
                            }
                          }
                        })
                      }
                    });
                    
                    setTimeout( next, 1);
                  }, () => {
                    nextParted();
                  }
                )
                
              },
              () => {                       
                if(isCalledBreak === false) {
                  writeToConsole({endParseTime: CoreFunctions.getCurrentTimestampMS(), duration: `${(CoreFunctions.getCurrentTimestampMS()-startParseTime)/1000}s`})
                  callback(null, 3);
                }
              }
            );

          },

          //Prepare to upload
          function (arg, callback){

            if(BREAK_SCAN === true)
              callback("BREAK_SCAN", null);

            SCAN_RESULT = {
              data: {
                NEW_VERSION: NEW_VERSION,
                ACTUAL_VERSION: ACTUAL_VERSION,
                ADD_LOCATION: ADD_LOCATION,
                REMOVE_LOCATION: REMOVE_LOCATION,
                FILE_LOCATIONS: FILE_LOCATIONS,
                FILES_SIZE: FILES_SIZE,
              },
      
              info: {
              MAX_FILE_SIZE: MAX_FILE_SIZE,
              TOTAL_SCANNED_DIRS:TOTAL_SCANNED_DIRS,
              TOTAL_FILES_SIZE: TOTAL_FILES_SIZE,
              TOTAL_FILES: TOTAL_FILES,
              TOTAL_UPLOAD_FILES_SIZE:TOTAL_UPLOAD_FILES_SIZE
              }
            }
      
            axios.post("/api/sync/addSync", {
              Person_id: Person.Person_id,
              Computer_id: Computer_id,
              Directory_name: "ALL",
              day_seconds: daySeconds,
              Status: "SUCCESS"
            }).then((r) => {
              if(r.data.result !== true)
                writeToConsole("AXIOS: ADD_SYNC", r.data);
              
              callback(null, 4);
            });

          },

          //Upload files to server
          function(arg, callback){

            if(BREAK_SCAN === true)
              callback("BREAK_SCAN", null);

            const {TOTAL_UPLOAD_FILES_SIZE} = SCAN_RESULT.info;
            const TOTAL_FILES_SIZE_HUM = CoreFunctions.convertBytesToNormal(TOTAL_UPLOAD_FILES_SIZE);
            const startUploadTime = CoreFunctions.getCurrentTimestampMS();

            let UPLOADED_FILES_SIZE = 0;
            let uploadPercent = 0;
            let counter = 0;
            let uploadSpeed = 0;
            let averageUploadSpeed = 0;
            let remainingTime = 0;

            writeToConsole({startUploadTime: startUploadTime});

            event.sender.send("SET_SYNC_DATA", {
              action: "UPLOAD_FILES",
              uploadPercent: null,
              currentFile: null,
              totalFilesSize: TOTAL_FILES_SIZE_HUM,
              uploadedSize: CoreFunctions.convertBytesToNormal(UPLOADED_FILES_SIZE),
              uploadSpeed: uploadSpeed,
              remainingTime:remainingTime
            });

            const filesToUpload = FILE_LOCATIONS.filter((x) => x.isUploaded === false);
            const countFilesToUpload = filesToUpload.length;

            // Upload files
            if(countFilesToUpload > 0){     
            // if(true === false){     
              mapStep(filesToUpload, 
                async (file, next) => {

                  if(BREAK_SCAN === true)
                    callback("BREAK_SCAN", null);

                  counter++;

                  const {path} = file;
                  const startFileUpload = CoreFunctions.getCurrentTimestampMS();
                  const fileSize = file.size;
                  const step = Math.ceil(fileSize*100/TOTAL_UPLOAD_FILES_SIZE*1000)/1000;

                  event.sender.send("SET_SYNC_DATA", {
                    action: "UPLOAD_FILES",
                    uploadPercent: uploadPercent,
                    uploadFile: path,
                    totalFilesSize: TOTAL_FILES_SIZE_HUM,
                    uploadedSize: CoreFunctions.convertBytesToNormal(UPLOADED_FILES_SIZE),
                    uploadSpeed: uploadSpeed,
                    remainingTime:remainingTime
                  });

                  UPLOADED_FILES_SIZE = counter !== countFilesToUpload ? UPLOADED_FILES_SIZE + fileSize : TOTAL_UPLOAD_FILES_SIZE;
                  uploadPercent = counter !== countFilesToUpload ? Math.ceil((step+uploadPercent)*1000)/1000 : 100;

                  try{
                    fs.promises.access(path, fs.constants.F_OK);

                    const fileBin = fs.createReadStream(path);
                    let formData = new FormData();
                    formData.append("file", fileBin);   
                    const formHeaders = formData.getHeaders();

                    const uploadResult = await axios.post(SERVER+'/app/upload.php', formData, {
                      headers: {
                        ...formHeaders,
                      },
                      maxContentLength: Infinity,
                      maxBodyLength: Infinity,
                    })
                    .then((r) => {                       
                      file.Server_path = r.data.result_data;
                    })
                    .catch((error) => {
                      if(error !== undefined || error.length > 0)
                        writeToConsole({error: error});
                    });

                    const remainTimeForUpload = CoreFunctions.getCurrentTimestampMS() - startFileUpload;
                    averageUploadSpeed += Math.ceil(Math.ceil(fileSize/remainTimeForUpload)/10)/100;  
                    uploadSpeed = Math.ceil(averageUploadSpeed/counter*100)/100;
                    remainingTime = (() => {
                      let sec = Math.ceil((CoreFunctions.convertBytesToMB(TOTAL_UPLOAD_FILES_SIZE) - CoreFunctions.convertBytesToMB(UPLOADED_FILES_SIZE))/uploadSpeed);
                      let min = sec > 0 ? parseInt(sec/60) : 0;

                      if(min !== 0)
                        sec = Math.ceil(sec - min*60);

                      return `${min !== 0 ? min+"m " : ""} ${sec}s`;
                    })();

                    event.sender.send("SET_SYNC_DATA", {
                      action: "UPLOAD_FILES",
                      uploadPercent: uploadPercent,
                      uploadFile: path,
                      totalFilesSize: TOTAL_FILES_SIZE_HUM,
                      uploadedSize: CoreFunctions.convertBytesToNormal(UPLOADED_FILES_SIZE),
                      uploadSpeed: uploadSpeed,
                      remainingTime:remainingTime
                    });         
                    
                    let locations = FILE_LOCATIONS.find((x) => x.hash === file.hash);
                    if(locations !== undefined){
                      locations = locations.locations.map((x) => x.path);
                    } else {
                      locations = [];
                    }

                    locations.push(file.path);

                    await axios.post("/api/file/addUploadedFile", {
                      Person_id: Person.Person_id,
                      File_name: file.name,
                      File_path: file.Server_path,
                      Mac_address: sysInfo.uuid.macs[0],
                      File_hash: file.hash,
                      File_info: pathinfo(file.path),
                      CREATED_DATE: file.CREATED_DATE,
                      File_locations: JSON.stringify(locations)

                    }).then((r) => writeToConsole(r.data));

                    next();
                  } catch(e) {
                    console.log(e);
                  }
                },
                () => {
                  writeToConsole({endUploadTime: CoreFunctions.getCurrentTimestampMS(), duration: `${(CoreFunctions.getCurrentTimestampMS()-startUploadTime)/1000}s`})
                  callback(null, 5);
                }
              )
            } else {
              event.sender.send("SET_SYNC_DATA", {
                action: null
              });

              writeToConsole({endUploadTime: CoreFunctions.getCurrentTimestampMS(), duration: `${(CoreFunctions.getCurrentTimestampMS()-startUploadTime)/1000}s`})
              callback(null, 5);
            }
          }
        ], function (err, result) {
          if(err === "BREAK_SCAN"){   
            event.sender.send("SET_SYNC_DATA", {action: null, reason: "BREAK_SCAN"});
            setTimeout( () => {BREAK_SCAN = false;}, 1000);
            axios.post("/api/sync/addSync", {
              Person_id: Person.Person_id,
              Computer_id: Computer_id,
              Directory_name: "ALL",
              day_seconds: daySeconds,
              Status: "BREAKED"
            }).then((r) => {
              if(r.data.result !== true)
                writeToConsole("AXIOS: ADD_SYNC", r.data);
              
              callback(null, 4);
            });
          }

          BLOCK_SYNC = false;

          event.sender.send("SET_SYNC_DATA", {action: null, reason: "SUCCESSFULLY_SCANNED"});
          event.sender.send("NEXT_SCAN", {scanEnd: CoreFunctions.getCurrentTimestamp()});
        });
      } catch (e){
        console.log(e.message)
      }    

      NEW_VERSION, ACTUAL_VERSION, ADD_LOCATION, REMOVE_LOCATION, FILE_LOCATIONS, FILES_SIZE, MAX_FILE_SIZE, TOTAL_SCANNED_DIRS, TOTAL_FILES_SIZE, TOTAL_UPLOAD_FILES_SIZE, TOTAL_FILES = null;
      
      
    } else {
      BLOCK_SYNC = false;
      writeToConsole({sync: "Wait interval", remain: userInterval-(serverTime-userLastSync)});
      event.sender.send("NEXT_SCAN", {scanEnd: CoreFunctions.getCurrentTimestamp()});
    }
  }
  event.sender.send("IS_SYNC_BLOCKED", {isSyncBlocked: BLOCK_SYNC})
  writeToConsole({BLOCK_SYNC: BLOCK_SYNC});
  
});

ipcMain.on("IS_SYNC_BLOCKED", (event, args) =>{
  event.sender.send("IS_SYNC_BLOCKED", {isSyncBlocked: BLOCK_SYNC})
})

ipcMain.on("BREAK_SCAN", (event, args) => {
  BREAK_SCAN = true;
});

ipcMain.on("showNotification", (event, args) => {
  const { title, body } = args;
  showNotification(title, body);
});

///MAIN///
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
