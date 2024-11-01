const fs = require("fs");
const Path = require("path");
const { insertDocText } = require("../services/Documents");
const {
  getSyncFile,
  getSyncParsingStepByKey,
  getNextSyncParsingStep,
  changeSyncFileParsingStep,
  getPrevSyncParsingStep,
  checkSyncFile,
} = require("../services/Sync");
const { mapStep, OCRmyPDF } = require("../lib/Functions");
const IO = require("./../socket");
const pdf = require("pdf-extraction");

let SOCKET_ID = null;
const STEP = "GET_FILE_TEXT";

// IO.on("connection", (socket) => {
//   socket.join(socket.id);
//   SOCKET_ID = socket.id;
// });

module.exports = async (path, stats, hostId, cbStart = () => {}, cb) => {

  const { pathInfo } = stats;
  const fileData = await getSyncFile(hostId, { Server_File_id: pathInfo.filename });
  const { Person_id, Computer_id, File_id, Parsing_Step_Key, Format:File_ext } = fileData;
  
  if(stats.stat.isFile()) {
    const nextStep = await getPrevSyncParsingStep(hostId, STEP);
    await changeSyncFileParsingStep(hostId, { fileInfo: stats, nextStep }, { Person_id, Computer_id, File_id });
    return;
  }

  //Check File
  const checkFile = await checkSyncFile(hostId, fileData, stats, STEP);

  if(!checkFile){
    cb();
    return;
  }

  //Get file data
  cbStart(fileData);
  // if (SOCKET_ID) IO.to(SOCKET_ID).emit("parsing-files", { Parsing_Step_Key, path, time: getCurrentTimestamp() });

  if (fs.existsSync(Path.join(path, "doc_data.txt"))) fs.unlinkSync(Path.join(path, "doc_data.txt"));

  const pages = fs.readdirSync(path);
  const makedOCR = [];

  //Remove Bad File
  if(!pages.length){
    const nextStep = await getSyncParsingStepByKey(hostId, "REMOVE_FILES");
    await changeSyncFileParsingStep(hostId, { fileInfo: stats, nextStep}, {Person_id, Computer_id, File_id});
    cb(fileData);
    return;
  }

  await mapStep(pages, 
    async (page, next, i) => {
      const pageNumber = parseInt(page);
      const filePath = Path.join(path, page);

      const pageText = await new Promise(async (fulfill, reject) => {
        let dataBuffer = fs.readFileSync(filePath);
        try {
          await pdf(dataBuffer).then((data) =>
            fulfill({ result: true, text: data.text, length: data.text ? data.text.length : 0 })
          );
        } catch (e) {
          fulfill({ result: false, e });
        }
      });

      if (!pageText.result) {
        await next();
        return;
      }

      if (pageText.length <= 50 && makedOCR.indexOf(i) === -1) {
        makedOCR.push(i);
        const OCR_Result = await OCRmyPDF(filePath);
        if (OCR_Result) await next(i);
        else await next();
      } else {
        await insertDocText(
          hostId,
          [
            {
              File_id: File_id,
              Page: pageNumber,
              Text: pageText.text,
            },
          ],
          { disableForeign: true }
        );
        await next();
      }
    },
    async () => {
      const nextStep = await getNextSyncParsingStep(hostId, Parsing_Step_Key);
      await changeSyncFileParsingStep(hostId, { fileInfo: stats, nextStep}, {Person_id, Computer_id, File_id});

      cb(fileData);
    }
  );    
};
