const path = require("path");
const fs = require("fs");
const fse = require('fs-extra');


const nodePath = process.argv[0];
const appPath = process.argv[1];
const HOST = process.argv[2];
const RECIEVED_ACTION = process.argv[3];

const ACTIONS = {
  NEW: "new",
  CLEAR: "clear",
  CLEAR_UPLOAD: "clear-upload",
  CHECK_STRUCTURE: "check",
  REMOVE: "remove",
  INFO: "info",
  INFO_DIRS: "info-dirs",
  INFO_FILES_COUNT: "files-count"
};

const {mainHostsDir, hostDirs} = require("../config/hostDirs");
const hostDirPath = path.join(mainHostsDir, HOST);

const checkHostDirs = (hostDirs, hostDirPath) => {
  hostDirs.map((x) => {
    const dir = path.join(hostDirPath, x.dirName);
    try{
      console.log(`Check host dir: ${dir}`);
      if(!fs.existsSync(dir)){
        fs.mkdirSync(dir, {recursive: true, mode: 0777});
        console.log(`mkdir ${dir}`);
      } else {
        console.log(`dir ${dir} already exists`);
      }
    } catch (e) {
      console.log(e.message);
      return false;
    }

    console.log()

    if(x.dirChildren) checkHostDirs(x.dirChildren, dir);
  });
};
const clearHostDirs = (hostDirs, hostDirPath) => {
  hostDirs.map((x) => {
    const dir = path.join(hostDirPath, x.dirName);
    try{
      console.log(`Check dir: ${dir}`);
      if(!fs.existsSync(dir)){
        console.log(`Not exists!`);
        console.log();
        return false;
      }
    } catch (e) {
      console.log(e.message);
      return false;
    }

    if(x.dirChildren) {
      console.log("Has children. Scan...");
      console.log();
      clearHostDirs(x.dirChildren, dir);
    } else {
      try{
        fse.emptyDirSync(dir);
        console.log(`Cleared!`);
        console.log();
      } catch (e) {
        console.log(e.message);
        console.log();
      }
    }
  });
};
const deepWatch = (dir, params) => {
  const arr = fs.readdirSync(dir);
  const hideFiles = false;//params ? params.hideFiles || false : false;

  for (let i = 0; i < arr.length; i++) {
    let dirPath = dir + "/" + arr[i];
    let stat = fs.statSync(dirPath);
    let dirs = [];

    if (stat && stat.isDirectory()) {
      dirs.push(dirPath);
    }
    
    // if(stat.isDirectory() || (stat.isFile() && !hideFiles))
    const sep = stat.isDirectory() ? "/" : ".";
    console.log(`${".".repeat(dirPath.split("/").length - 3)}${sep}${arr[i]}`);

    for(let k = 0; k < dirs.length; k++){
      deepWatch(dirs[k], params);
    }
  }
};
const countFiles = async (dir, {hideFiles, count, isMain} = {hideFiles: false, isMain: true, count: []}) => {
  const arr = fs.readdirSync(dir);
  let tmpCounter = 0;
  let dirs = [];

  for await (let el of arr) {
    let dirPath = dir + "/" + el;
    let stat = fs.statSync(dirPath);

    if (stat && stat.isDirectory()) {
      dirs.push(dirPath);
    } else {
      ++tmpCounter;
    }    
    // if(stat.isDirectory() || (stat.isFile() && !hideFiles))
    //   console.log(`${".".repeat(dirPath.split("/").length - 3)}/${arr[i]}`);
  }

  count.push({
    dir,
    files: tmpCounter
  });

  for await(let  tmpDir of dirs){
    const res = countFiles(tmpDir, {count, isMain: false});
    count.concat({isMain, res});
  }

  // if(isMain)
  //   console.log(count);
  return await count;
};

switch(RECIEVED_ACTION){
  case ACTIONS.NEW:
  case ACTIONS.CHECK_STRUCTURE: {
    const _result = {
      exists: [],
      mkdir: [],
    };
    try {
      if(!fs.existsSync(hostDirPath)){
        fs.mkdirSync(hostDirPath, {recursive: true, mode: 0777});
        console.log(`mkdir ${hostDirPath}`);
      } else {
        console.log(`dir ${hostDirPath} already exists`);
      }
      console.log();
    } catch (e) {
      console.log(e.message);
      return false;
    }

    console.log(`Check hosts dirs`);
    checkHostDirs(hostDirs, hostDirPath);
    console.log();
    break;
  }
  case ACTIONS.CLEAR: {
    try {
      console.log();
      console.log(`Check host dir: ${hostDirPath}`);
      console.log();
      if(!fs.existsSync(hostDirPath)){
        console.log(`${hostDirPath} is not exists`);
        console.log();
        return false;
      }
    } catch (e) {
      console.log(e.message);
      console.log();
      return false;
    }

    clearHostDirs(hostDirs, hostDirPath);

    break;
  }
  case ACTIONS.CLEAR_UPLOAD: {
    try {
      console.log();
      console.log(`Check host dir: ${hostDirPath}`);
      console.log();
      if(!fs.existsSync(hostDirPath)){
        console.log(`${hostDirPath} is not exists`);
        console.log();
        return false;
      }
    } catch (e) {
      console.log(e.message);
      console.log();
      return false;
    }

    clearHostDirs(hostDirs.filter((x) => x.dirName === "upload"), hostDirPath);

    break;
  }
  case ACTIONS.REMOVE: {
    try {
      console.log(`Check host dir: ${hostDirPath}`);
      if(!fs.existsSync(hostDirPath)){
        console.log(`dir ${hostDirPath} is not exists`);
        return false;
      }

      fs.rmdirSync(hostDirPath, {recursive: true});
      console.log(`Removed successfully: ${hostDirPath}`);
    } catch (e) {
      console.log(e.message);
      return false;
    }

    break;
  }
  case ACTIONS.INFO: {
    try {
      console.log();
      console.log(`Info of ${hostDirPath}:`);
      console.log();

      if(!fs.existsSync(hostDirPath)){
        console.log(`dir ${hostDirPath} is not exists`);
        return false;
      }

      deepWatch(hostDirPath);
      console.log();

    } catch (e) {
      console.log(e.message);
      return false;
    }

    break;
  }
  case ACTIONS.INFO_DIRS: {
    try {
      console.log();
      console.log(`Info of ${hostDirPath}:`);
      console.log();

      if(!fs.existsSync(hostDirPath)){
        console.log(`dir ${hostDirPath} is not exists`);
        return false;
      }

      const count = countFiles(hostDirPath);
      console.log(count);
      console.log();

    } catch (e) {
      console.log(e.message);
      return false;
    }

    break;
  }
  case ACTIONS.INFO_FILES_COUNT: {
    try {
      console.log();
      console.log(`Files Info of ${hostDirPath}:`);
      console.log();

      if(!fs.existsSync(hostDirPath)){
        console.log(`dir ${hostDirPath} is not exists`);
        return false;
      }

      countFiles(hostDirPath, {hideFiles: true});
      console.log();

    } catch (e) {
      console.log(e.message);
      return false;
    }

    break;
  }
  
  default:
    console.log("Wrong action recieved!");
    return false;
}
