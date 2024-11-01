const fs = require("fs");
const { getFileHash, mapStep } = require("../lib/functions");
const {
  addNewVersion,
  removeLocation,
} = require("./../core/SyncManager");
const path = require("path");

const checkLocations = async (
  docLocations, 
  cb = {
    beforeFileCheckCb: (data = {file: Object}) => {}, 
    afterFileCheckCb: (data = {file: Object, isExists: Boolean}) => {},  
    endCheckCb: () => {}
  }) => {
  if (docLocations && docLocations.length > 0) {
    let fileStat = null;
    let file = null;

    await mapStep(docLocations, async (loc, next) => {
      cb.beforeFileCheckCb({file: loc});

      loc.File_path = path.join(loc.File_dir, loc.File_name);
      let newHash = fs.existsSync(loc.File_path) ? getFileHash(loc.File_path) : false;

      cb.afterFileCheckCb({file: loc, isExists: loc !== undefined && fs.existsSync(loc.File_path), isNewVersion: newHash ? ![...loc.versions, loc.File_id].includes(newHash) : false, newHash});

      file = null;
      fileStat = null;

      setTimeout(async () => await next(), 1);
    }, () => cb.endCheckCb());
      
    
  }
};

const addFileLocation = async (file) => {

}

const removeFileLocation = async (file) => {

}

const addNewFileVersion = async (file) => {

}

module.exports = { checkLocations };


