const { app } = require('electron');
const path = require('path');

const APP_DATA_FOLDER = app.getPath("userData");
const APP_DATA_FILE_EXT = ".json";

const AppDB = (db, cb) => {
    const APP_DATA_FILE_NAME = db;
    const PATH_TO_FILE = path.join(APP_DATA_FOLDER, `${APP_DATA_FILE_NAME}${APP_DATA_FILE_EXT}`);
    if(cb){
      cb(PATH_TO_FILE);
    }
    return require('node-localdb')(PATH_TO_FILE); 
}

module.exports = AppDB;