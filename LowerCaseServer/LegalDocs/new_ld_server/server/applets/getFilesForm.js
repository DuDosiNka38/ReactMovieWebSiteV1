const { mapStep } = require("../lib/Functions");
const fs = require("fs");
const { getFiles, getDocText, detectFileForm, updateFile } = require("../services/Documents");
const path = require("path");

const HOST = "ilona";
const FILE = path.join(__dirname, "fileForms.json");

async function writeToFile(add){
  let data = [];

  if(fs.existsSync(FILE))
    data = JSON.parse(fs.readFileSync(FILE));

  data.push(add);

  await fs.writeFileSync(FILE, JSON.stringify(data));
}

async function main() {
  console.log(" _______________________");
  console.log("(                       )");
  console.log("( FORMS DETECTOR: 0.0.1 )");
  console.log("(_______________________)");
  console.log("                       ");

  const files = await getFiles(HOST, {Form: "UNCLASSIFIED"});
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

    while(text.indexOf("  ") !== -1){
      text = text.replace(/  /g, " ");
    }
    
    while(text.indexOf("\n") !== -1){
      text = text.replace(/\n/g, "");
    }

    let formDetect = null;

    try{
      formDetect = await detectFileForm(HOST, {Text: text});
    } catch (e) {
      // console.log("Error:", e.message);
      // console.log(`Go to Next File...`);
      // console.log(``);
      // console.log(``);
      await next();
    }
    
    if(!formDetect){
      // console.log(`Form isn't detected!`);
      // console.log(`Go to Next File...`);
      // console.log(``);
      // console.log(``);
      await next();
      return;
    }

    const { Form, score }  = formDetect;

    detectCounter++;

    // await writeToFile({
    //   File_id: file.File_id,
    //   Form
    // });

    updateFile(HOST, {Form}, file.File_id);

    console.log(`  ${i+1} / ${length}`);
    console.log(`( File ID:`, file.File_id)
    console.log(`( Form:`, Form)
    console.log(`( Detect Score:`, score)
    console.log("");
    console.log("");

    
    await next();
  })

  console.log(`( Detected files:`, detectCounter)

  process.exit(0);
}


main();