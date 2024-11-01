const moment = require('moment');
const dbConfig = require('./../config/db.config');
const { dbPreset } = require('./../config/config.dev');

const { mapStep, mapPartedStep } = require("./../lib/Functions");
const { mainHostsDir } = require("./../config/hostDirs");
const fs = require("fs");
const path = require('path');
const { exec } = require('child_process');
const saveBackupsToGit = require('./saveBackupsToGit');

const MAIN_BACKUP_DIR = path.resolve("/home/backup/");
const backupDir = path.resolve("/home/backup/sqlBackups/");

const hostsList = fs.readdirSync(mainHostsDir);

const formatedDate = moment().format("YYYYMMDD");
const fileName = `${formatedDate}.sql`;

const MAX_BKP_COUNT = 14;

async function makeBackup({
  username,
  password,
  database,
  pathToFile
}){
  return await new Promise(function (fulfill, reject){
    exec(`mysqldump ${database} > ${pathToFile}`, (err, stdout, stderr) => {
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

async function checkDir(dirPath){
  console.log("|");
  console.log("|- Check Dir: ", dirPath);
  if(!fs.existsSync(dirPath)) {
    console.log("|  Create...");
    await fs.mkdirSync(dirPath, {recursive: true});
    console.log("|  Set Permissions");
    await fs.chmodSync(dirPath, 0777);

  } else {
    console.log("|  Already Exists");
  }
  console.log("|");
}

async function App() {
  console.log(".. DB_Backup_Applet Starts ..");
  console.log("|");
  console.log("|- Hosts Found: ", hostsList.length);
  console.log("|");

  try {
    //Check Is Backups Dir exists | If Not Create Dir
    await checkDir(backupDir);

    //TODO: Check count of backups and remove old

    //Map All Hosts
    await mapStep(hostsList, async (host, next) => {
      const hostBackupDir = path.join(backupDir, host)
      //Check Host Backup Dir | If Not Create
      await checkDir(hostBackupDir);
      
      console.log("|");
      console.log("|- Make DB Backup for: ", host);
      try {
        const r = await makeBackup({
          username: dbConfig.user,
          password: dbConfig.password,
          database: `${dbPreset.database}${host}`,
          pathToFile: path.join(hostBackupDir, fileName)
        })
        console.log({r})
        console.log("|  Successfully");
      } catch (error) {        
        console.log("|  Error: ", error.message);
      } finally {
        console.log("|");
      }      

      await next();
    });

  } catch (error) {
    console.log("|  Error: ", error.message);
  } finally {
    console.log("|_ DB_Backup_Applet Finished! _|");
    console.log();
    console.log();
    saveBackupsToGit(formatedDate, MAIN_BACKUP_DIR);
  }
}

App();