const { findDates } = require("find-dates");
const { mapStep } = require("../lib/Functions");
const { getFiles, getDocText, detectFileForm, updateFile } = require("../services/Documents");

const HOST = "ilona";

async function main() {

  const files = await getFiles(HOST, {Form: "SUBP-010"}, {});
  const length = files.length;

  let detectCounter = 0;

  console.log("(  Total Files: ", length);
  console.log("");

  

  await mapStep(files, async (file, next, i) => {
    const fileData = await getDocText(HOST, {File_id: file.File_id, Page: 1});

    if(!fileData || !fileData[0]) {
      // console.log(`Text isn't exists..`);
      // console.log(`Go to Next File...`);
      // console.log(``);
      // console.log(``);
      await next();
      return;
    }

    let text = fileData[0].Text;

    if(!text.length){
      // console.log(`First Page Text is empty`);
      // console.log(`Go to Next File...`);
      // console.log(``);
      // console.log(``);
      await next();
      return;
    }

    const dates = findDates(text);
    console.log({fileId: fileData[0].File_id, dates})
    
    await next();
  })

  console.log(`( Detected files:`, detectCounter)

  process.exit(0);
}


main();