const fs = require("fs");
const path = require("path");
const pathinfo = require("pathinfo");
const { mapStep, mapPartedStep } = require("./lib/Functions");
const { mainHostsDir } = require("./config/hostDirs");
const getFileTextWatcher = require("./watchers/getFileText.watcher");
const getFileFormWatcher = require("./watchers/getFileForm.watcher");
const getFileCaseWatcher = require("./watchers/getFileCase.watcher");
const getFilePreviewWatcher = require("./watchers/getFilePreview.watcher");
const getPdfWatcher = require("./watchers/getPdf.watcher");
const getFileExtWatcher = require("./watchers/getFileExt.watcher");
const getBurstFileWatcher = require("./watchers/getBurstFile.watcher");
const getFileMetaWatcher = require("./watchers/getFileMeta.watcher");
const combineFileWatcher = require("./watchers/combineFile.watcher");

const saveOriginalWatcher = require("./watchers/saveOriginal.watcher");
const autoSaveWatcher = require("./watchers/autoSave.watcher");
const { updateFileParseInfo } = require("./services/Sync");

console.log("Watcher starts");

const MAIN_DIR = mainHostsDir;

const WATCHERS = {
  "save-original": saveOriginalWatcher,
  "get-file-ext": getFileExtWatcher,
  "get-pdf": getPdfWatcher,
  "get-file-meta": getFileMetaWatcher,
  "get-burst-file": getBurstFileWatcher,
  "get-file-text": getFileTextWatcher,
  "combine-file": combineFileWatcher,
  "get-file-case": getFileCaseWatcher,
  "get-file-form": getFileFormWatcher,
  "get-file-preview": getFilePreviewWatcher,
  "auto-save": autoSaveWatcher
};


const IGNORE_HOSTS = [
  // "ilona",
  "test"
];

let WATCHED = [];
let PROCESSING = [];

deepWatch = function* (dir, host) {
  const list = fs.readdirSync(dir);
  let stat = null;

  function* takeItem(arr, dir, host) {
    for (let i = 0; i < arr.length; i++) {
      dirPath = dir + "/" + arr[i];
      stat = fs.statSync(dirPath);

      if (stat && stat.isDirectory()) {
        /* Recurse into a subdirectory */
        if(WATCHERS[arr[i]]){
          yield {path: dirPath, watcher: WATCHERS[arr[i]], host:host, watcherKey: arr[i] };
        }
        for (const v of deepWatch(dirPath, host)) {
          yield v;
        }
      }
    }
  }

  for (const v of takeItem(list, dir, host)) {
    yield v;
  }
};

const watchDir = async (dir) => {
  if(fs.existsSync(dir.path)){
    let list = await fs.readdirSync(dir.path);
    const MAX_FILES_IN_STEP = 1;
    const TIMEOUT = (1000+(Math.random()*1000));
    let WORK_FILES_NUM = list.length >= MAX_FILES_IN_STEP ? MAX_FILES_IN_STEP : list.length;


    if(list.length && PROCESSING.indexOf(dir.path) === -1){

      let filesList = [];
      
      await mapStep(list, async (fPath, next, i) => {  
        const watchPath = path.join(dir.path, fPath);
        const stat = await fs.statSync(watchPath);
        filesList.push({ path: fPath, stat });
  
        await next();
      }, async () => {
          // filesList.sort((a, b) => (a.path < b.path));
          filesList.sort(function (a, b) {
            return a.stat.size - b.stat.size;
          })

          list = filesList.map((x) => (x.path));
  
          // console.log("lIST", {list : filesList.slice(4000, 4050).map((x) => ({p: x.path, s: x.stat.size}))})
      });

      const startWatcherTime = Date.now();
      PROCESSING.push(dir.path);

      
      console.log(
        {
          "Watched Dir": dir.path, 
          "Action": "Start Working",
          "Start Time": startWatcherTime, 
          // "Duration Of Watcher Function Work": `${(Date.now()-startWatcherTime)/1000} sec`,
          "Total Files": list.length,
          "In Current Work": WORK_FILES_NUM
        }
      );

      await mapStep(list.slice(0, WORK_FILES_NUM), async (filePath, next) => {
        const watchPath = path.join(dir.path, filePath);
        // console.log({
        //   File: watchPath,
        //   Watcher: dir.watcherKey
        // })

        await dir.watcher(watchPath, {stat: fs.statSync(watchPath), pathInfo: pathinfo(watchPath)}, dir.host, 
        (data) => {
          if(data){
            updateFileParseInfo(dir.host, {
              File_id: data.File_id,
              Step_Key: data.Parsing_Step_Key
            })
          }
        },
        (data) => {
          if(data){
            updateFileParseInfo(dir.host, {
              File_id: null,
              Step_Key: data.Parsing_Step_Key
            })
          }
          next();
        });
      }, async () => {
        PROCESSING = PROCESSING.filter((x) => x !== dir.path);
        setTimeout(() => watchDir(dir), list.length-WORK_FILES_NUM > 0 ? 1000 : TIMEOUT);

        console.log(
          {
            "Watched Dir": dir.path, 
            "Action": "Stop Working",
            "Start Time": startWatcherTime, 
            "End Time": Date.now(), 
            "Duration Of Watcher Function Work": `${(Date.now()-startWatcherTime)/1000} sec`,
            "Total Worked Files": list.length
          }
        );
      });
    } else {
      setTimeout(() => watchDir(dir), TIMEOUT);
    }
  } else {
    if(WATCHED.indexOf(dir.path) !== -1)
      WATCHED = WATCHED.splice(WATCHED.indexOf(dir.path), 1);
  }
}
const watchDirs = () => {
  let stat = null;
  let dirPath = null;
  let hosts = fs.readdirSync(MAIN_DIR);

  for(let host of hosts){
    if(!IGNORE_HOSTS.includes(host)){
      dirPath = path.join(MAIN_DIR, host);
      stat = fs.statSync(dirPath);

      if (stat && stat.isDirectory()) {
        for (let dir of deepWatch(dirPath, host)) {
          console.log("DIr: ", dir);
          if(WATCHED.indexOf(dir.path) === -1)
            WATCHED.push(dir.path);

          watchDir(dir);
        }
      }
    }
  }
}

watchDirs();

console.log({Hosts_Dir: MAIN_DIR});
console.log({Watch_Dirs: WATCHED});

fs.watch(MAIN_DIR, (eventType, filename) => {
  console.log("FS WATCH", eventType, filename);
  console.log(WATCHED);
  watchDirs();
})






