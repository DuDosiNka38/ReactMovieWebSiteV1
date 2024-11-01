const { getDocText } = require("../services/Documents");
const { getSyncFile, getNextSyncParsingStep, changeSyncFileParsingStep, checkSyncFile } = require("../services/Sync");
const { getUserCases } = require("../services/Case");
const { mapStep } = require("../lib/Functions");

module.exports = async (path, stats, hostId, cbStart = () => {}, cb) => {
  const { pathInfo, stat } = stats;
  const fileData = await getSyncFile(hostId, { Server_File_id: pathInfo.filename });
  
  //Check File
  const checkFile = await checkSyncFile(hostId, fileData, stats, "GET_FILE_CASE");
  if(!checkFile){
    cb();
    return;
  }

  //Get file data
  const { Person_id, Computer_id, File_id, Parsing_Step_Key, Case_NAME} = fileData;
  cbStart(fileData);
  let CaseName = null;
  let isCaseFind = false;

  //Parse Case Name
  if(Case_NAME === null){
    const Cases = await getUserCases(hostId, Person_id);

    await mapStep(Cases, async (Case, next) => {
      if(!isCaseFind){
        if(Case.Case_Number){
          if(Case.Case_Number[0] === "0"){
            Case.Case_Number = Case.Case_Number.substr(1);
          }

          const matches = await getDocText(hostId, { File_id, Page: 1, _like: { field: "Text", value: `%${Case.Case_Number}%`} });
          
          if(matches?.length !== 0){
            isCaseFind = true;
            CaseName = Case.Case_Short_NAME;
          }
        }
      }
      next();
    });
  } 
  
  const nextStep = await getNextSyncParsingStep(hostId, Parsing_Step_Key);
  await changeSyncFileParsingStep(hostId, { fileInfo: stats, nextStep, set: {Case_NAME: Case_NAME ? Case_NAME : CaseName}}, { Person_id, Computer_id, File_id});

  cb(fileData);  
};