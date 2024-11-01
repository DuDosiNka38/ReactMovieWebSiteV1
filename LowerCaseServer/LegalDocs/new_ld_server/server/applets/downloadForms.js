var http = require('https');
var fs = require('fs');
var { mapStep } = require("./lib/Functions");
const path = require('path');

var download = function(url, dest, cb) {
  var file = fs.createWriteStream(dest);
  var request = http.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);  // close() is async, call cb after close completes.
    });
  }).on('error', function(err) { // Handle errors
    console.log(err.message);
    // fs.unlink(dest); // Delete the file async. (But we don't check the result)
    // if (cb) cb(err.message);
  });
};

async function main() {
  const forms = require("./forms.json");
  const destination = path.join(__dirname, "forms");
  
  console.log("___________________________");
  console.log("                           ");
  console.log("| FORMS DOWNLOADER: 0.0.1 |");
  console.log("___________________________");
  console.log("                           ");
  
  console.log("Destination dir: ", destination);
  console.log(" ");

  console.log("Check is destination dir exists...");
  
  if(!fs.existsSync(destination)){
    console.log("Create destination dir...");
    fs.mkdirSync(destination);
  } else {
    console.log("Success.");
  }
  console.log(" ");

  console.log("Set destination dir permissions...");
  
  if(!fs.existsSync(destination)){
    console.log("Successfully set...");
    fs.chmodSync(destination, 0777);
  }
  console.log(" ");
  
  console.log("Download process is started!");
  
  await mapStep(forms, async (form, next, i) => {
    console.log(`START Download Form "${form.form}"`);
    console.log(i+1, "/", forms.length)
    download(form.href, path.join(destination, `${form.form.replace("*", "").trim().replace(" ", "_")}.pdf`), () => {
      console.log(`-- Form "${form.form}" downloaded!`);
      console.log("                           ");
      next();
    });
  });
  
  console.log("Download process is ended!");
}

main();
 