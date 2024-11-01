const { ipcMain, dialog, BrowserWindow } = require("electron");
const fs = require("fs");
const path = require("path");
const request = require("request");

ipcMain.on("download", async (event, args) => {
  const { defaultDir, defaultFileName, downloadUrl, Format, SESSION } = args;
  
  let options = {
    title: "Save Document File",
    buttonLabel: "Save File",

    filters: [
      //  {name: 'Documents', extensions: ['jpg', 'png', 'gif']},
      Format ? { name: Format, extensions: [Format] } : { name: "All Files", extensions: ["*"] },
    ],
  };

  options.defaultPath = "";

  if (defaultDir) {
    options.defaultPath = defaultDir;
  }

  if (defaultFileName) {
    options.defaultPath = path.join(options.defaultPath, defaultFileName);
  }

  const downloadPath = await dialog.showSaveDialog(BrowserWindow.getFocusedWindow(), options);

  if (downloadPath) {
    const file = fs.createWriteStream(downloadPath);

    let donwloadSize = 0;

    var received_bytes = 0;
    var total_bytes = 0;

    var req = request({
      method: "GET",
      uri: downloadUrl,
    });

    const localFileName = downloadPath.split("/").reverse()[0];

    req.pipe(file);

    req.on("response", function (data) {
      // Change the total bytes value to get progress later.
      total_bytes = parseInt(data.headers["content-length"]);

      event.sender.send("download/start", { start: true, total_bytes, localFileName, SESSION });
    });

    req.on("data", function (chunk) {
      // Update the received bytes
      received_bytes += chunk.length;
      event.sender.send("download/progress", { received_bytes, total_bytes, SESSION });
    });

    req.on("end", function () {
      event.sender.send("download/success", { result: true, savePath: downloadPath, SESSION, File_name: localFileName, File_dir: downloadPath.replace(localFileName, "") });
    });

    req.on("error", (e) => {
      event.sender.send("download/error", { e, SESSION });
    });
    event.returnValue = true;
  } else {
    event.sender.send("download/error", { result: false, e: {code: "CANCEL_DOWNLOAD"}, SESSION });
    event.returnValue = false;
  }
});
