const SyncService = require("../services/Sync");

const Sync = {
  getSyncShare: async (req, res) => {        
    const SyncShare = await SyncService.getSyncShare(req.hostId, req.params);
    res.send(SyncShare);
  },

  insertSyncSharePersons: async (req, res) => {        
    const SyncShare = await SyncService.insertSyncSharePersons(req.hostId, req.body);
    res.send(SyncShare);
  },

  deleteSyncSharePersons: async (req, res) => {        
    const SyncShare = await SyncService.deleteSyncSharePersons(req.hostId, req.params);
    res.send(SyncShare);
  },

  getSyncSharedPersons: async (req, res) => {        
    const SyncSharedPersons = await SyncService.getSyncSharedPersons(req.hostId, req.params.Person_id);
    res.send(SyncSharedPersons);
    // 
  },

  getSyncSchedule: async (req, res) => {        
    const SyncSchedule = await SyncService.getSyncSchedule(req.hostId, req.params);
    res.send(SyncSchedule);
  },

  insertSyncSchedule: async (req, res) => {        
    const SyncSchedule = await SyncService.insertSyncSchedule(req.hostId, req.body);
    res.send(SyncSchedule);
  },

  deleteSyncSchedule: async (req, res) => {        
    const SyncSchedule = await SyncService.deleteSyncSchedule(req.hostId, req.params);
    res.send(SyncSchedule);
  },


  getSyncFiles: async (req, res) => {        
    const SyncFiles = await SyncService.getSyncFiles(req.hostId);
    res.send(SyncFiles);
  },


  getSyncFile: async (req, res) => {        
    const SyncFiles = await SyncService.getSyncFile(req.hostId, req.params);
    res.send(SyncFiles);
  },

  getUserSyncFiles: async (req, res) => {        
    const SyncFiles = await SyncService.getUserSyncFiles(req.hostId, req.params);
    res.send(SyncFiles);
  },

  getUserSyncFilesWithLocations: async (req, res) => {        
    const SyncFiles = await SyncService.getUserSyncFilesWithLocations(req.hostId, req.params);
    res.send(SyncFiles);
  },

  getUserSyncFilesFiltered: async (req, res) => {        
    const SyncFiles = await SyncService.getUserSyncFilesFiltered(req.hostId, req.params.Person_id, req.body);
    res.send(SyncFiles);
  },

  insertSyncFiles: async (req, res) => {        
    const SyncSchedule = await SyncService.insertSyncFiles(req.hostId, req.body);
    res.send(SyncSchedule);
  },

  updateSyncFiles: async (req, res) => {        
    const SyncFiles = await SyncService.updateSyncFiles(req.hostId, req.body);
    res.send(SyncFiles);
  },

  deleteSyncSchedule: async (req, res) => {        
    const SyncSchedule = await SyncService.deleteSyncSchedule(req.hostId, req.params);
    res.send(SyncSchedule);
  },

  getSyncParsingSteps: async(req, res) => {
    const SyncParsingSteps = await SyncService.getSyncParsingSteps(req.hostId);
    res.send(SyncParsingSteps);
  },

  saveSyncedFiles: async (req, res) => {
    await SyncService.saveSyncedFiles(req.hostId, req.body, res);
    // res.send(result);
  },

  removeSyncedFiles: async (req, res) => {
    return await SyncService.removeSyncedFiles(req.hostId, req.body, res);
    // res.send(result);
  },

  deleteSyncFiles: async (req, res) => {
    const result = await SyncService.deleteSyncFiles(req.hostId, req.params);
    res.send(result);
  },

  // addScannedFolder: async (req, res) => {
  //   await SyncService.removeSyncedFiles(req.hostId, req.body, res);
  //   // res.send(result);
  // }



  getSynchronizations: async(req, res) => {
    const result = await SyncService.getSynchronizations(req.hostId);
    res.send(result);
  },

  getUserSynchronizations: async(req, res) => {
    const result = await SyncService.getUserSynchronizations(req.hostId, req.params);
    res.send(result);
  },

  insertSynchronization: async (req, res) => {
    const result = await SyncService.insertSynchronization(req.hostId, req.body);
    res.send(result);
  },

  updateSynchronization: async (req, res) => {
    const result = await SyncService.updateSynchronization(req.hostId, req.body);
    res.send(result);
  },

  insertSyncFolder: async (req, res) => {
    const result = await SyncService.insertSyncFolder(req.hostId, req.body);
    res.send(result);
  },

  getUserSyncFolders: async (req, res) => {        
    const result = await SyncService.getUserSyncFolders(req.hostId, req.params);
    res.send(result);
  },

  insertSyncFolderInfo: async (req, res) => {
    const result = await SyncService.insertSyncFolderInfo(req.hostId, req.body);
    res.send(result);
  },

  getUserParseInfo: async (req, res) => {        
    const result = await SyncService.getUserParseInfo(req.hostId, req.params);
    res.send(result);
  },

  getFileParseInfo: async (req, res) => {        
    const result = await SyncService.getFileParseInfo(req.hostId, req.params);
    res.send(result);
  },
};

module.exports = Sync;