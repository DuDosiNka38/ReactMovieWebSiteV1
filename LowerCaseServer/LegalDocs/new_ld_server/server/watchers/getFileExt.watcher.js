const { getSyncFile, getSyncParsingStepByKey, getNextSyncParsingStep, changeSyncFileParsingStep, checkSyncFile } = require("../services/Sync");

module.exports = async (path, stats, hostId, cbStart = () => {}, cb) => {
  const { pathInfo } = stats;
  const fileData = await getSyncFile(hostId, { Server_File_id: pathInfo.filename });

  //Check File
  const checkFile = await checkSyncFile(hostId, fileData, stats, "GET_FILE_EXT");
  if(!checkFile){
    cb();
    return;
  }

  //Get file data
  const { Person_id, Computer_id, File_id, Parsing_Step_Key, Format:File_ext } = fileData;
  cbStart(fileData);
  let nextStep = null;

  if(File_ext.toLowerCase() === "pdf")
    nextStep = await getNextSyncParsingStep(hostId, Parsing_Step_Key);
  else
    nextStep = await getSyncParsingStepByKey(hostId, "GET_PDF"); 

  await changeSyncFileParsingStep(hostId, {
    fileInfo: stats,
    nextStep
  }, { Person_id, Computer_id, File_id });

  cb(fileData);
};