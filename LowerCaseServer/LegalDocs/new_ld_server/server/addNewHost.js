const { exec, execSync } = require('child_process');
const path = require('path');
const PATH_TO_TEMPLATE = path.join(__dirname, "data", "db_tmplt.sql");

const isHostExists = async () => {

}

const createDb = async (HOST) => {
  return await new Promise(function (fulfill, reject){
    exec(`node HostsManager/createDb.js ${HOST}`, (err, stdout, stderr) => {
      if(err) reject(err);
      if(stderr) reject(stderr);
      
      fulfill(JSON.parse(stdout));
    });
  });
}

const importDbTemplate = async (dbName, userName) => {
  const command = `mysql -u ${userName} ${dbName} < ${PATH_TO_TEMPLATE}`;
  return await new Promise(function (fulfill, reject){
    exec(command, (err, stdout, stderr) => {
      if(err) reject(err);
      if(stderr) reject(stderr);
      
      fulfill(stdout);
    });
  });
}

const createDirectories = async (HOST) => {
  const command = `node HostsManager/hostDirsManager.js ${HOST} new`;
  return await new Promise(function (fulfill, reject){
    exec(command, (err, stdout, stderr) => {
      if(err) reject(err);
      if(stderr) reject(stderr);
      
      fulfill(stdout);
    });
  });
}

const main = async () => {
  const nodePath = process.argv[0];
  const appPath = process.argv[1];
  const HOST = process.argv[2];


  console.log("------------------------------------------------");
  console.log("STEP 1/3");
  console.log("------------------------------------------------");
  console.log(`Create Database and Db User for ${HOST} host...`);
  console.log("------------------------------------------------");
  console.log();
  const dbResult = await createDb(HOST);

  if(dbResult.err){
    console.log(dbResult.err);
    return false;
  }
  console.log("------------------------------------------------");
  console.log("STEP 2/3");
  console.log("------------------------------------------------");
  console.log(`Import Db Structure from template for ${HOST} host...`);
  console.log("------------------------------------------------");
  console.log();
  await importDbTemplate(dbResult.MYSQL_DB, dbResult.MYSQL_USER);
  
  console.log("------------------------------------------------");
  console.log("STEP 3/3");
  console.log("------------------------------------------------");
  console.log(`Create directories of ${HOST} host...`);
  console.log("------------------------------------------------");
  console.log();
  await createDirectories(HOST);
  console.log("Host successfully created!");
}

main();
