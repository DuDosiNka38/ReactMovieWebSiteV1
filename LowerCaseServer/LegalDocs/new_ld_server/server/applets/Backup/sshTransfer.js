
const { exec } = require('child_process');

const sshTransfer = async (pathFrom, pathTo) => {
  await execSync(`scp  -P 1112 ${pathFrom} legal_docs_install@dev.managelegaldocs.com:${pathTo}`)
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

module.exports = sshTransfer;