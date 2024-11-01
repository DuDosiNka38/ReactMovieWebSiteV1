const { ipcRenderer } = require("electron");

async function checkLocations(args, cb){
  ipcRenderer.send("SYNC/CHECK_LOCATIONS", args);
  cb();
}

export { checkLocations };