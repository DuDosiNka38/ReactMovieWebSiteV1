const pathinfo = require("pathinfo");
const fs = require("fs");
const Path = require("path");
const { getSyncFile, getSyncParsingStepByKey, getNextSyncParsingStep, moveAndUpdate, checkSyncFile, changeSyncFileParsingStep } = require("../services/Sync");
const { mainHostsDir, uploadDir } = require("../config/hostDirs");

module.exports = async (path, stats, hostId, cbStart = () => {}, cb) => {
  const { pathInfo } = stats;
  const fileData = await getSyncFile(hostId, { Server_File_id: pathInfo.filename });

  //Check File
  const checkFile = await checkSyncFile(hostId, fileData, stats, "GET_PDF");
  
  if(!checkFile){
    cb();
    return;
  }

  //Get file data
  const { Person_id, Computer_id, File_id, Parsing_Step_Key, Format:File_ext } = fileData;
  cbStart(fileData);
  const libre = require("libreoffice-convert");
  const extend = '.pdf';

  // Read file
  // Convert it to pdf format with undefined filter (see Libreoffice doc about filter)
  const file = fs.readFileSync(path);
  
  const convertedFile = await new Promise(function (fulfill, reject){
    libre.convert(file, extend, undefined, async (err, done) => {
      if (err) {
        reject(err);
      }

      fulfill(done);
    });
  })
  .catch((e) => (false));

  // Here in done you have pdf file which you can save or transfer in another stream
  if(convertedFile){
    const HOST_FOLDER = Path.join(mainHostsDir, hostId);
    const nextStep = await getNextSyncParsingStep(hostId, Parsing_Step_Key);

    const originalStep = await getSyncParsingStepByKey(hostId, "PARSED");
    const originalNextFolder = Path.join(HOST_FOLDER, uploadDir, originalStep.Step_folder);
    const originalFilePath = Path.join(originalNextFolder, pathInfo.filename);
    
    //Move original file
    fs.renameSync(path, originalFilePath);
    //Save converted file
    fs.writeFileSync(path, convertedFile);

    await changeSyncFileParsingStep(hostId, {
      fileInfo: stats,
      nextStep
    }, { Person_id, Computer_id, File_id });
  }
  
  cb(fileData);
    
};