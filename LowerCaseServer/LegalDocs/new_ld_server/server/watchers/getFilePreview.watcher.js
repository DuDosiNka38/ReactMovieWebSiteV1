const fs = require("fs");
const Path = require("path");
const { getSyncFile, getNextSyncParsingStep, moveAndUpdate, changeSyncFileParsingStep, checkSyncFile } = require("../services/Sync");
const { mainHostsDir, uploadDir, dataDir } = require("../config/hostDirs");
const { exec } = require("child_process");
const { updateFile } = require("../services/Documents");

module.exports = async (path, stats, hostId, cbStart = () => {}, cb) => {
  const HOST_FOLDER = Path.join(mainHostsDir, hostId);
  const { pathInfo, stat } = stats;
  const fileData = await getSyncFile(hostId, { Server_File_id: pathInfo.filename });

  //Check File
  const checkFile = await checkSyncFile(hostId, fileData, stats, "GET_FILE_PREVIEW");
  if (!checkFile) {
    cb();
    return;
  }

  //Get file data
  const { Person_id, Computer_id, File_id, Parsing_Step_Key, Case_NAME } = fileData;
  cbStart(fileData);
  const previewDir = Path.join(HOST_FOLDER, dataDir, "preview", File_id[0]);

  if (!fs.existsSync(previewDir)) {
    fs.mkdirSync(previewDir, { mode: 0777 });
  }
  // nice -n 10 
  const makePreview = await new Promise(function (fulfill, reject) {
    exec(`pdftoppm -png -singlefile ${path} ${Path.join(previewDir, File_id)}`, (err, stdout, stderr) => {
      if (err) reject(err);
      if (stderr) reject(stderr);

      fulfill(stdout);
    });
  })
    .then((r) => true)
    .catch((e) => false);

  const nextStep = await getNextSyncParsingStep(hostId, Parsing_Step_Key);

  await updateFile(hostId, {Preview_img: Path.join(previewDir, `${File_id}.png`)}, File_id);

  await changeSyncFileParsingStep(
    hostId,
    {
      fileInfo: stats,
      nextStep,
      set: {
        Parsed: new Date().toISOString().slice(0, 19).replace("T", " "),
        File_preview: Path.join(previewDir, `${File_id}.png`),
      },
    },
    { Person_id, Computer_id, File_id }
  );

  cb(fileData);
};
