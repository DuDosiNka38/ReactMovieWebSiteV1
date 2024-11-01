const pdf = require("pdf-extraction");
const fs = require('fs');
const path = require('path');
var { mapStep, getCurrentTimestamp } = require("./../lib/Functions");
const { exec } = require("child_process");
const { insertDocFormText } = require("./../services/Documents");
var pathinfo = require('pathinfo');

const formsDir = "../forms";
const formsFiles = fs.readdirSync(formsDir);

const getFileText = async (filePath) => {
  const fName = pathinfo(filePath).basename;
  const tmpFile = path.join(__dirname, `${getCurrentTimestamp().toString()}_${fName}.txt`);

  return await new Promise(function (fulfill, reject){
    exec(`pdftotext -f 1 -l 1 -layout ${filePath} ${tmpFile}`, (err, stdout, stderr) => {
      if(err) reject(err);
      if(stderr) reject(stderr);
      
      fulfill(stdout);
    });
  }).then((r) => {
    const text = fs.readFileSync(tmpFile, 'utf8');
    if(fs.existsSync(tmpFile))
      fs.unlinkSync(tmpFile);
    return text;
  }).catch((e) => {
    if(fs.existsSync(tmpFile))
      fs.unlinkSync(tmpFile);
    return e.message;
  });
}

console.log("_______________________");
console.log("                       ");
console.log("| FORMS READER: 0.0.1 |");
console.log("_______________________");
console.log("                       ");

async function main() {
  await mapStep(formsFiles, async (file, next, i) => {    
    file = path.join(formsDir, file);
    console.log("Reads FP from file: ", file);
    console.log(i+1, "/", formsFiles.length);

    const text = await getFileText(file);
    console.log("-- Insert text to DB");
    try{
      await insertDocFormText("ilona", {
        Form: pathinfo(file).basename.replace("*", "").trim().replace(" ", "_"),
        Page: 1,
        Text: text
      });
      console.log("---- Successfully ended!");
    } catch (e) {      
      console.log("---- Error!");
      console.log("------ ", e.message);
    } finally {
      console.log(" ");
      next();
    }
    

    
  })
}
 
main();


