const express = require("express");
const { getSyncShare, deleteSyncSharePersons, insertSyncSharePersons, getSyncSchedule, insertSyncSchedule, deleteSyncSchedule, insertSyncFiles, getSyncFiles, getUserSyncFiles, getUserSyncFilesFiltered, getSyncSharedPersons, updateSyncFiles, saveSyncedFiles, removeSyncedFiles, insertSynchronization,
  insertSyncFolder, 
  deleteSyncFiles,
  getUserSyncFolders, insertSyncFolderInfo, getSynchronizations, getUserSynchronizations, updateSynchronization, getUserSyncFilesWithLocations, getUserParseInfo, getSyncFile, getFileParseInfo } = require("../route-actions/Sync");

const syncRouter = express.Router();
const jsonParser = express.json();

syncRouter.get("/sync/share/:Person_id", getSyncShare);
syncRouter.post("/sync/share/persons", jsonParser, insertSyncSharePersons);
syncRouter.delete("/sync/share/person/:Share_to_Person_id", deleteSyncSharePersons);

syncRouter.get("/sync/shared-persons/:Person_id", getSyncSharedPersons);


syncRouter.get("/sync/schedule/:Person_id", getSyncSchedule);
syncRouter.post("/sync/schedule", jsonParser, insertSyncSchedule);
syncRouter.delete("/sync/schedule/:Row_id", deleteSyncSchedule);


syncRouter.get("/sync/files", getSyncFiles);
syncRouter.get("/sync/file/user/:Person_id/computer/:Computer_id/file/:File_id", getSyncFile);
syncRouter.get("/sync/files/user/:Person_id", getUserSyncFiles);
syncRouter.post("/sync/files/user/:Person_id/filtered", jsonParser, getUserSyncFilesFiltered);
syncRouter.get("/sync/files/user/:Person_id/computer/:Computer_id", getUserSyncFilesWithLocations);
syncRouter.get("/sync/files/user/:Person_id/computer/:Computer_id/locations", getUserSyncFilesWithLocations);

syncRouter.post("/sync/files", jsonParser, insertSyncFiles); 
syncRouter.put("/sync/files", jsonParser, updateSyncFiles); 

syncRouter.post("/sync/files/save", jsonParser, saveSyncedFiles); 
syncRouter.post("/sync/files/remove", jsonParser, removeSyncedFiles); 
syncRouter.delete("/sync/file/:File_id/user/:Person_id/computer/:Computer_id", deleteSyncFiles);

syncRouter.get("/synchronizations", getSynchronizations); 
syncRouter.get("/synchronizations/user/:Person_id", getUserSynchronizations); 
syncRouter.post("/sync", jsonParser, insertSynchronization); 
syncRouter.put("/sync", jsonParser, updateSynchronization); 

syncRouter.post("/sync/folder", jsonParser, insertSyncFolder); 
syncRouter.get("/sync/folders/user/:Person_id/computer/:Computer_id", getUserSyncFolders); 

syncRouter.post("/sync/folder/info", jsonParser, insertSyncFolderInfo);


syncRouter.get("/sync/parse-info/user/:Person_id", getUserParseInfo);
syncRouter.get("/sync/file-parse-info", getFileParseInfo);


// syncRouter.put("/computer/:Person_id/:Mac_Address", jsonParser, updateComputer);

module.exports = syncRouter;
