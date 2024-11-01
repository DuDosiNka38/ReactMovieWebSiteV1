
const { exec } = require('child_process');

module.exports = saveBackupsToGit = async (commit, gitDir) => {
  console.log("... SAVE BACKUPS TO GIT ...");
  console.log("|");

  console.log("|-  git add .");
  await execSync(`
    cd ${gitDir}
    git add .
  `);
  console.log(`|-  git commit -m "${commit}"`);
  await execSync(`
    cd ${gitDir} 
    git commit -m "${commit}"
  `);
  console.log(`|-  git push`);
  await execSync(`
    cd ${gitDir} 
    git push git@github.com:syn-fermera/dbi-backups.git
  `);

  console.log("... END ...")
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