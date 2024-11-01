const pathinfo = require("pathinfo");
const fs = require("fs");
const Path = require("path");
const { getSyncFile, getSyncParsingStepByKey, getNextSyncParsingStep, changeSyncFileParsingStep, checkSyncFile, insertFileParseInfo } = require("../services/Sync");
const { exec } = require("child_process");
const fse = require("fs-extra");

const STEP_KEY = "GET_BURST_FILE";

module.exports = async (path, stats, hostId, cbStart = () => {}, cb) => {
  const { pathInfo, stat } = stats;

  if(stat.isDirectory()) {
    cb();
    fse.removeSync(path);
    return;
  }

  const fileData = await getSyncFile(hostId, { Server_File_id: pathInfo.filename });
  
  //Check File
  const checkFile = await checkSyncFile(hostId, fileData, stats, STEP_KEY);
  if(!checkFile){
    cb();
    return;
  }

  //Get file data
  const { Person_id, Computer_id, File_id, Parsing_Step_Key, Server_File_id} = fileData;
  cbStart(fileData);
  const insertResult = insertFileParseInfo(hostId, {
    File_id,
    Step_Key: STEP_KEY    
  });

  const burstFolder = Path.join(pathInfo.dirname, `_${pathInfo.filename}`);

  if(!fs.existsSync(burstFolder))
    fs.mkdirSync(burstFolder, 0777);

  //Burst file for get text
  // nice -n 10 
  await new Promise(function (fulfill, reject){
    exec(`pdftk ${path} burst output ${burstFolder}/%010d`, (err, stdout, stderr) => {
      if(err) reject(err);
      if(stderr) fulfill(stderr);
      
      fulfill(stdout);
    });
  })
  .then(async (r) => {
    const nextStep = await getNextSyncParsingStep(hostId, Parsing_Step_Key);
    await changeSyncFileParsingStep(hostId, {fileInfo: {...fs.statSync(burstFolder), pathInfo: {...pathinfo(burstFolder), filename: Server_File_id}}, nextStep}, {Person_id, Computer_id, File_id});

    fs.unlinkSync(path);
    cb(fileData);
  })
  .catch(async (e) => {
    console.log(e);
    const nextStep = await getSyncParsingStepByKey(hostId, "REMOVE_FILES");
    await changeSyncFileParsingStep(hostId, { fileInfo: stats, nextStep}, {Person_id, Computer_id, File_id});
    cb(fileData);
  });
};