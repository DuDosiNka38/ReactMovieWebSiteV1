const pathinfo = require("pathinfo");
const fs = require("fs");
const Path = require("path");
const { getSyncFile, getNextSyncParsingStep, checkSyncFile, changeSyncFileParsingStep, insertFileParseInfo, updateFileParseInfo } = require("../services/Sync");
const { mapPartedStep, mapStep } = require("../lib/Functions");
const fse = require("fs-extra");
const { exec } = require("child_process");

// const PDFMerge = require("pdf-merge");

const PDFMerge = async (data, {output}) => {
  return await new Promise(function (fulfill, reject){
    let pages = null;

    if(typeof data === "string"){
      pages = data;
    }

    if(typeof data === "Array" || Array.isArray(data)){
      pages = data.join(" ");
    }

    if(pages === null){
      return { result: false, error: "Wrong argument."};
    }
    // nice -n 10 
    exec(`pdftk ${pages} cat output ${output}`, (err, stdout, stderr) => {
      if(err) reject(err);
      if(stderr) fulfill(stderr);
      
      fulfill(stdout);
    });
  })
  .then(async (r) => ({ result: true }))
  .catch(async (e) => ({ result: false, error: e }));
}

const STEP_KEY = "COMBINE_FILE";

module.exports = async (path, stats, hostId, cbStart = () => {}, cb) => {
  const { pathInfo } = stats;
  const fileData = await getSyncFile(hostId, { Server_File_id: pathInfo.filename });

  //Check File
  const checkFile = await checkSyncFile(hostId, fileData, stats, STEP_KEY);
  if (!checkFile) {
    cb();
    return;
  }

  
  if (fs.existsSync(Path.join(path, "doc_data.txt"))) fs.unlinkSync(Path.join(path, "doc_data.txt"));

  //Get file data
  const { Person_id, Computer_id, File_id, Parsing_Step_Key } = fileData;
  cbStart(fileData);
  const insertResult = insertFileParseInfo(hostId, {
    File_id,
    Step_Key: STEP_KEY    
  });

  console.log({insertResult});

  let tmpPath = Path.join(path, "tmp");
  if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);

  const pages = fs.readdirSync(path).map((x) => Path.join(path, x));

  if (pages.length > 10) {
    let tmp = tmpPath;
    let lastFile = null;
    await mapPartedStep(
      pages,
      10,
      async (part, next, i, total) => {
        // const prevTmp = i > 0 ? `${tmpPath}${i-1}` : "";
        // const nextTmp = `${tmpPath}${i}`;

        if (lastFile && fs.existsSync(lastFile)) {
          part = [lastFile, ...part];
        }

        if (part.length > 1) {
          await PDFMerge(part, { output: tmp}).then(async () => {
            lastFile = part[part.length-1];

            await mapStep(part, async (file, nextFile) => {
              if(file !== tmp && fs.existsSync(file)){
                fs.unlinkSync(file);
              }

              await nextFile(); 
            }, async () => {
              fs.renameSync(tmp, lastFile);

              if(fs.existsSync(lastFile)){
                await fs.chmodSync(lastFile, 0777);
              }
            })

            setTimeout( async () => await next(), 500);
          });
        } else {
          await next();
        }
      },
      async (total) => {
        
        stats.pathInfo = {...pathinfo(lastFile), filename: pathInfo.filename};

        const nextStep = await getNextSyncParsingStep(hostId, Parsing_Step_Key);
        await changeSyncFileParsingStep(hostId, { fileInfo: stats, nextStep }, { Person_id, Computer_id, File_id });

        fse.remove(path);

        cb(fileData);
      }
    );
  } else {
    await PDFMerge(pages, { output: tmpPath });
    stats.pathInfo = {...pathinfo(tmpPath), filename: pathInfo.filename};

    const nextStep = await getNextSyncParsingStep(hostId, Parsing_Step_Key);
    await changeSyncFileParsingStep(hostId, { fileInfo: stats, nextStep }, { Person_id, Computer_id, File_id });

    fse.remove(path);

    cb(fileData);
  }

  // updateFileParseInfo(hostId, {
  //   File_id,
  //   Step_Key: STEP_KEY    
  // });
};
