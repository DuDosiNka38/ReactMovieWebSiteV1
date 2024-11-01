const { insertDocMetadata } = require("../services/Documents");
const { getSyncFile, getSyncParsingStepByKey, checkSyncFile, changeSyncFileParsingStep } = require("../services/Sync");
const { mapObj } = require("../lib/Functions");
const { exec } = require("child_process");

module.exports = async (path, stats, hostId, cbStart = () => {}, cb) => {
  const { pathInfo } = stats;
  const fileData = await getSyncFile(hostId, { Server_File_id: pathInfo.filename });
  
  //Check File
  const checkFile = await checkSyncFile(hostId, fileData, stats, "GET_FILE_META");
  if(!checkFile){
    cb();
    return;
  }

  //Get file data
  const { Person_id, Computer_id, File_id, Parsing_Step_Key, Format:File_ext } = fileData;
  cbStart(fileData);
  //GET METADATA & INSERT TO DATABASE
  // nice -n 10 
  await new Promise(function (fulfill, reject){
    exec(`exiftool -json ${path}`, (err, stdout, stderr) => {
      if(err) reject(err);
      if(stderr) reject(stderr);
      
      fulfill(JSON.parse(stdout)[0]);
    });
  })
  .then(async (pdfInfo) => {  
    pdfInfo.pages = pdfInfo.PageCount;

    const DocMetadata = [];
    await mapObj(pdfInfo, (v, i, o) => {
      DocMetadata.push({
        File_id,
        Name: i,
        Value: v
      });
    });
    
    await insertDocMetadata(hostId, DocMetadata, {disableForeign: true});

    const nextStep = await getSyncParsingStepByKey(hostId, "GET_BURST_FILE");
    await changeSyncFileParsingStep(hostId, { fileInfo: stats, nextStep},{Person_id, Computer_id, File_id});
    cb(fileData);
  })
  .catch(async (e) => {
    const nextStep = await getSyncParsingStepByKey(hostId, "REMOVE_FILES");
    await changeSyncFileParsingStep(hostId, { fileInfo: stats, nextStep, where: {Person_id, Computer_id, File_id}});
    cb(fileData);
  }); 
       
};