const {
  getSyncFile,
  getSyncParsingStepByKey,
  getNextSyncParsingStep,
  changeSyncFileParsingStep,
  checkSyncFile,
} = require("../services/Sync");
const Path = require("path");
const fse = require('fs-extra')

const { mainHostsDir, libraryFilesDir, uploadDir } = require("../config/hostDirs");
const { insertDocumentLocations, insertDocument, insertDocumentFiles } = require("../services/Documents");
const md5 = require("md5");

const STEP_KEY = "SAVE_ORIGINAL";

module.exports = async (path, stats, hostId, cbStart = () => {}, cb) => {
  const HOST_FOLDER = Path.join(mainHostsDir, hostId);
  const { pathInfo } = stats;
  const fileData = await getSyncFile(hostId, { Server_File_id: pathInfo.filename });

  //Check File
  const checkFile = await checkSyncFile(hostId, fileData, stats, STEP_KEY);
  if (!checkFile) {
    cb();
    return;
  }

  //Get file data
  const { Person_id, Computer_id, File_id, Parsing_Step_Key, Format: File_ext, Upload_dt, Case_NAME, File_name, CREATED_DATE } = fileData;
  cbStart(fileData);
  let nextStep = await getNextSyncParsingStep(hostId, Parsing_Step_Key);

  if(Case_NAME){
    //Path's
    const fileFolder = Path.join(libraryFilesDir, File_id[0]);
    const fileName = `${File_id}.${File_ext}`;
    
    //Make Dir if NOT exists
    if (!fs.existsSync(Path.join(HOST_FOLDER, fileFolder))) {
      fs.mkdirSync(Path.join(HOST_FOLDER, fileFolder), 0777);
    }
    
    //Copy File To Dest Dir
    fse.copyFileSync(
      path,
      Path.join(HOST_FOLDER, fileFolder, fileName)
    );

    //Create Document
    const resultInsDoc = await insertDocument(
      hostId,
      {
        DOCUMENT_NAME: File_name,
        Description: `Document for ${File_name}`,
        Case_NAME: Case_NAME,
        Person_id: Person_id,
        Form: "UNCLASSIFIED",
        CREATED_DATE: CREATED_DATE,
      }
    );


    const resultInsDocFile = await insertDocumentFiles(
      hostId,
      {
        File_id: File_id,
        DOC_ID: resultInsDoc.DOC_ID,
      }
    );
    
    //Add Location
    const DocLocs = [
      {
        File_id: File_id,
        Person_id: "SERVER",
        Computer_id: "SERVER",
        File_name: fileName,
        File_dir: Path.join(HOST_FOLDER, fileFolder),
        File_path_hash: md5(Path.join(HOST_FOLDER, fileFolder, fileName)),
        loaded_dt: Upload_dt,
      },
    ];              
  
    const resultInsDocLoc = await insertDocumentLocations(hostId, DocLocs);
  }  

  await changeSyncFileParsingStep(
    hostId,
    {
      fileInfo: stats,
      nextStep,
    },
    { Person_id, Computer_id, File_id }
  );

  cb(fileData);
};
