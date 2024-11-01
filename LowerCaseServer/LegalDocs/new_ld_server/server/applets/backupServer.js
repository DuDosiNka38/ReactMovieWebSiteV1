const path = require('path');
const moment = require('moment');
const fs = require('fs');
const { exec } = require('child_process');

const SERVER_DIR = path.resolve("./../../server");
const MAIN_DIR = path.resolve("./../../");

const formatedDate = moment().format("YYYYMMDD");

const backupServer = async () => {
  console.log("Start")
  const tmpDir = path.join(MAIN_DIR, `tmp_${formatedDate}`);

  // await fs.mkdirSync(tmpDir);
  // await fs.chmodSync(tmpDir, 0777);

  // await execSync(
  //   `cd ${MAIN_DIR}
  //   cp ${SERVER_DIR} ${tmpDir} -r
  // `);
  
  // if(!fs.existsSync(tmpDir)){
  //   console.log("Folder isn't exists: ", tmpDir);
  //   return;
  // }

  // await execSync(`
  //   cd ${tmpDir}
  //   rm -rf node_modules/
  // `);

  await execSync(`
    cd ${MAIN_DIR}
    zip -r /home/backup/server/${formatedDate}.zip ${SERVER_DIR}/* -x "${SERVER_DIR}/node_modules/*" -x "${SERVER_DIR}/forms/*"
  `)

  console.log("End");
} 

async function execSync(command){
  return await new Promise(function (fulfill, reject){
    exec(command, (err, stdout, stderr) => {
      if(err) reject(err);
      if(stderr) reject(stderr);
      
      fulfill(stdout);
    });
  }).then((r) => {
    return r;
  }).catch((e) => {
    throw e;
  });
}

backupServer();


module.exports = backupServer;
