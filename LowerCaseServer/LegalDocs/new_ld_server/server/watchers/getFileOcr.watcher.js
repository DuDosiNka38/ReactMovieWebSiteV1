const pathinfo = require("pathinfo");
const fs = require("fs");
const Path = require("path");
const { getSyncFile, getSyncParsingStepByKey, getNextSyncParsingStep, moveAndUpdate } = require("../services/Sync");
const { mainHostsDir, uploadDir } = require("../config/hostDirs");
const { exec } = require("child_process");

module.exports = async (path, stats, host) => {
  const HOST_FOLDER = Path.join(mainHostsDir, host);
  let pathInfo = pathinfo(path);
  const fileData = await getSyncFile(host, { File_Server_name: pathInfo.filename });

  if (fileData) {
    const { Person_id, Computer_id, File_id, Parsing_Step_Key } = fileData;

    if (Parsing_Step_Key === "GET_PDF_OCR") {
      const ocrFileName = pathInfo.basename+".ocr"+pathInfo.extname;
      const ocrPath = Path.join(pathInfo.dirname, ocrFileName);
      const ocrResponse = await new Promise(function (fulfill, reject){
        exec(`nice -n 10 ocrmypdf --rotate-pages ${path} ${ocrPath}`, (err, stdout, stderr) => {
          if(err) reject(err);
          if(stderr) reject(stderr);
          
          fulfill(stdout);
        });
      })
      .then((r) => (true))
      .catch((e) => (false));

      //Broken
      if(!ocrResponse && !fs.existsSync(ocrPath)){
        fs.unlinkSync(path);
      }

      const nextStep = await getNextSyncParsingStep(host, Parsing_Step_Key);
      const nextFolder = Path.join(HOST_FOLDER, uploadDir, nextStep.Step_folder);
      const newFilePath = Path.join(nextFolder, ocrFileName);  

      const originalStep = await getSyncParsingStepByKey(host, "ORIGINAL_EXT");
      const originalNextFolder = Path.join(HOST_FOLDER, uploadDir, originalStep.Step_folder);
      const originalFilePath = Path.join(originalNextFolder, pathInfo.filename);
      
      //Move original file
      fs.renameSync(path, originalFilePath);

      await moveAndUpdate({
        oldPath: ocrPath,
        newPath: newFilePath,
        host,
        set: {
          Parsing_Step_Key: nextStep.Step_Key,
        },
        where: {
          Person_id,
          File_id,
          Computer_id,
        },
      });
    } else {
      const nextStep = await getSyncParsingStepByKey(host, Parsing_Step_Key);
      const nextFolder = Path.join(HOST_FOLDER, uploadDir, nextStep.Step_folder);
      const newFilePath = Path.join(nextFolder, pathInfo.filename);

      await moveAndUpdate({
        oldPath: path,
        newPath: newFilePath,
        host,
        set: {
          Parsing_Step_Key: nextStep.Step_Key,
        },
        where: {
          Person_id,
          File_id,
          Computer_id,
        },
      });
    }
  } else {
    fs.unlinkSync(path);
  }
};