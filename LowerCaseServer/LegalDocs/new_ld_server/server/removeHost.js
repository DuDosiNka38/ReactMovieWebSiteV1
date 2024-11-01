const { exec, execSync } = require('child_process');
const path = require('path');

const dropDb = async (HOST) => {
  return await new Promise(function (fulfill, reject){
    exec(`node HostsManager/dropDb.js ${HOST}`, (err, stdout, stderr) => {
      if(err) reject(err);
      if(stderr) reject(stderr);
      
      fulfill(JSON.parse(stdout));
    });
  });
}

const removeDirectories = async (HOST) => {
  const command = `node HostsManager/hostDirsManager.js ${HOST} remove`;
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

  console.log(`Drop Database and Db User for ${HOST} host...`);
  const dbResult = await dropDb(HOST);

  if(dbResult.err){
    console.log(dbResult.err);
    return false;
  }
  
  console.log(`Remove directories of ${HOST} host...`);
  await removeDirectories(HOST);
  console.log("Host successfully removed!");
}

main();
