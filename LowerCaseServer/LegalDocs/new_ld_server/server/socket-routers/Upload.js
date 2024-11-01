const md5 = require('md5');
const vhost = require('vhost');
const { getCurrentTimestamp } = require("./../lib/Functions");
const path = require("path");
const fs = require("fs");
const { updateSyncFile, getSyncParsingStepByKey, getNextSyncParsingStep } = require('../services/Sync');
const { mainHostsDir, uploadTmpDir, uploadDir } = require('../config/hostDirs');

module.exports.UploadFile = (stream, fileData, socket, hostId) => {
  const HOST_FOLDER = path.join(mainHostsDir, hostId);
  const TMP_FOLDER = path.join(HOST_FOLDER, uploadTmpDir);

  // const room = `DBI-${socket.id}`;
  // socket.join(room);

  const {File_name, Computer_id, File_id, File_size, Person_id, File_path, File_ext } = fileData;
  const tmpFileName = md5(Computer_id+File_id+File_ext);
  const tmpFilePath = path.join(TMP_FOLDER, tmpFileName);
  const writeSream = fs.createWriteStream(tmpFilePath);
  const upload = stream.pipe(writeSream);     

  upload.once('open', () => {
    socket.emit('uploadMessage', {
      status: 'START_UPLOAD',
      File_id: File_id
    });
  })

  let progress = 0;
  stream.on('data', (chunk) => {
    progress += chunk.length;
    var perc = parseInt((progress/File_size)*100);
    socket.emit('uploadProgress', {
      File_id: File_id,
      File_uploaded_percents: perc,
      File_uploaded_size: progress,
    });
  })

  stream.once('error', (streamErr) => {
    socket.emit('uploadMessage', {
      status: 'ERROR',
      File_id: File_id,
    });
  });

  writeSream.once('finish', async () => {
    let nextStep = await getNextSyncParsingStep(hostId, "TMP");
    let nextFolder = path.join(HOST_FOLDER, uploadDir, nextStep.Step_folder);
    let newFilePath = path.join(nextFolder, tmpFileName);

    fs.renameSync(tmpFilePath, newFilePath);
    await updateSyncFile(hostId, {
      Parsing_Step_Key: nextStep.Step_Key,
      Upload_dt: new Date().toISOString().slice(0, 19).replace("T", " "),
      Server_File_id: tmpFileName,
    }, {
      Person_id: Person_id,
      File_id: File_id,
      Computer_id: Computer_id
    })
    socket.emit('uploadFinish', {
      status: 'END_UPLOAD',
      File_id: File_id
    });
  });
};
