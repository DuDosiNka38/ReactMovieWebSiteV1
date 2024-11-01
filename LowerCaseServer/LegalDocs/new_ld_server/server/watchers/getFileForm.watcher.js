const { getDocForms, getDocText, detectFileForm, updateFile, updateDocument, getFileDocument } = require("../services/Documents");
const { getSyncFile, getNextSyncParsingStep, checkSyncFile, changeSyncFileParsingStep } = require("../services/Sync");
const { mapStep } = require("../lib/Functions");

module.exports = async (path, stats, hostId, cbStart = () => {}, cb) => {
  const { pathInfo, stat } = stats;
  const fileData = await getSyncFile(hostId, { Server_File_id: pathInfo.filename });

  //Check File
  const checkFile = await checkSyncFile(hostId, fileData, stats, "GET_FILE_FORM");
  if (!checkFile) {
    cb();
    return;
  }

  //Get file data
  const { Person_id, Computer_id, File_id, Parsing_Step_Key } = fileData;
  cbStart(fileData);
  let fileForm = "UNCLASSIFIED";

  const DocForms = (await getDocForms(hostId)).map((x) => x.Form);

  let FirstPage = await getDocText(hostId, { File_id, Page: 1 });

  if (FirstPage) {
    try{
      let text = FirstPage[0];

      while(text.indexOf("—") !== -1){
        text = text.replace(/—/g, "-");
      }

      const Form = await detectFileForm(hostId, {Text: text});


      if(!Form){
        throw false; 
      }

      await updateFile(hostId, { Form }, File_id);

      const File_Doc = await getFileDocument(hostId, { File_id });

      if(File_Doc){
        await updateDocument(hostId, { Form }, File_Doc.DOC_ID);
      }

      const nextStep = await getNextSyncParsingStep(hostId, Parsing_Step_Key);
      await changeSyncFileParsingStep(hostId, { fileInfo: stats, nextStep, set: {Form}}, { Person_id, Computer_id, File_id});
      cb(fileData); 
    } catch (e) {
      const nextStep = await getNextSyncParsingStep(hostId, Parsing_Step_Key);
      await changeSyncFileParsingStep(hostId, { fileInfo: stats, nextStep, set: {Form: fileForm}}, { Person_id, Computer_id, File_id});
      cb(fileData);
      return;
    }
  } else {
    const nextStep = await getNextSyncParsingStep(hostId, Parsing_Step_Key);
    await changeSyncFileParsingStep(hostId, { fileInfo: stats, nextStep, set: {Form: fileForm}}, { Person_id, Computer_id, File_id});
    cb(fileData); 
  } 
  
 
};
