const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const SERVER_DIR = "/var/www/server";
const MAIN_DIR = "/var/www/";

const backupServer = async (MAIN_BACKUP_DIR, formatedDate) => {
  console.log("Start Server Backup")
  const zipPath = path.join(MAIN_BACKUP_DIR, "server", `${formatedDate}.zip`);

  await execSync(`
    cd ${MAIN_DIR}
    sudo zip -r ${zipPath} ${SERVER_DIR}/* -x "${SERVER_DIR}/node_modules/*" -x "${SERVER_DIR}/forms/*"
  `)

  console.log("End Server Backup");

  return zipPath;

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


module.exports = backupServer;
