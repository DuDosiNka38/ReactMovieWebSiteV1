
const moment = require('moment');
const backupDb = require("./backupDb");
const backupServer = require("./backupServer");
const path = require('path');
const saveBackupsToGit = require("./saveBackupsToGit");
const sshTransfer = require('./sshTransfer');
const MAIN_BACKUP_DIR = "/home/backup/";

const formatedDate = moment().format("YYYY-MM-DD_hh:mm:ss");
const remotePath = "/home/legal_docs_install/ld_backups/";

async function makeBackup(){
  const serverFilePath = await backupServer(MAIN_BACKUP_DIR, formatedDate);
  await sshTransfer(serverFilePath, path.join(remotePath, "server", `${formatedDate}.zip`));
  const sqlFilePath = await backupDb(MAIN_BACKUP_DIR, formatedDate);
  await sshTransfer(sqlFilePath, path.join(remotePath, "db", `${formatedDate}.zip`))
  // await saveBackupsToGit(formatedDate, MAIN_BACKUP_DIR);
}

makeBackup();