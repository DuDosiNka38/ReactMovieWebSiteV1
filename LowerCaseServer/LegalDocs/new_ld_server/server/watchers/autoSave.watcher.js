const md5 = require("md5");
const md5File = require("md5-file");
const Path = require("path");
const fse = require("fs-extra");

const { mainHostsDir, libraryFilesDir, uploadDir } = require("../config/hostDirs");

const {
  getFileDocument,
  insertDocumentFiles,
  insertDocumentLocations,
  insertFiles,
  getFile,
  updateFile,
  updateDocument,
} = require("../services/Documents");

const {
  getSyncFile,
  getSyncParsingStepByKey,
  getNextSyncParsingStep,
  changeSyncFileParsingStep,
  checkSyncFile,
  deleteSyncFiles
} = require("../services/Sync");

const STEP_KEY = "AUTO_SAVE";

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
  const {
    Person_id,
    Computer_id,
    File_id,
    Parsing_Step_Key,
    Format: File_ext,
    Upload_dt,
    Case_NAME,
    Form,
    File_preview,
  } = fileData;

  cbStart(fileData);

  const new_File_id = await md5File(path);
  const File = await getFile(hostId, { File_id });
  const File_Doc = await getFileDocument(hostId, { File_id });

  if (File) {
    if (File.Form !== Form) {
      await updateFile(hostId, { Form }, File_id);
    }
  }

  if (File_Doc) {
    if (File_Doc.Form !== Form) {
      await updateDocument(hostId, { Form }, File_Doc.DOC_ID);
    }

    if (File_Doc.Case_NAME !== Case_NAME) {
      await updateDocument(hostId, { Case_NAME }, File_Doc.DOC_ID);
    }

    //File changed
    if (new_File_id !== File_id && File_Doc) {
      const DOC_ID = File_Doc.DOC_ID;

      //Path's
      const fileFolder = Path.join(libraryFilesDir, new_File_id[0]);
      const fileName = `${new_File_id}.${File_ext}`;

      //Make Dir if NOT exists
      if (!fs.existsSync(Path.join(HOST_FOLDER, fileFolder))) {
        fs.mkdirSync(Path.join(HOST_FOLDER, fileFolder), 0777);
      }

      //Copy File To Dest Dir
      fse.moveSync(path, Path.join(HOST_FOLDER, fileFolder, fileName));
      const InsertFile = await insertFiles(hostId, [
        {
          File_id: new_File_id,
          Format: File_ext,
          Form,
          Size: stats.stat.size,
          CREATED_DATE: stats.stat.birthtime,
          Preview_img: File_preview,
        },
      ]);

      const resultInsDocFile = await insertDocumentFiles(hostId, {
        File_id: new_File_id,
        DOC_ID,
      });

      //Add Location
      const DocLocs = [
        {
          File_id: new_File_id,
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

    await deleteSyncFiles(hostId, { File_id });
  } else {
    let nextStep = await getNextSyncParsingStep(hostId, Parsing_Step_Key);

    await changeSyncFileParsingStep(
      hostId,
      {
        fileInfo: stats,
        nextStep,
      },
      { Person_id, Computer_id, File_id }
    );
  }  

  cb(fileData);
};
