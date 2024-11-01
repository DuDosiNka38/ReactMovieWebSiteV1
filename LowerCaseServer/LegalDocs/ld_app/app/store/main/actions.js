const { SET_AUTH_HASH, SET_SYSTEM_INFO, SET_IS_BLOCKED_SYNC, ADD_FILE_LOCATION, ADD_NEW_VERSION, REMOVE_LOCATION, INCREASE_SCANNED_FOLDERS, INCREASE_SCANNED_FILES, ADD_NEW_FILE, SET_DEFAULT_SYNC_STATE, INCREASE_NEW_FILES, INCREASE_NEW_FILES_SIZE, ADD_SCANNED_FOLDER, SET_IS_UPLOAD_CONFIRMED, ADD_REGISTERED_FILE } = require("./actionTypes");

module.exports.setSystemInfo = (data) => ({
	type: SET_SYSTEM_INFO,
	payload:  data
});

module.exports.setAuthHash = (hash) => ({
	type: SET_AUTH_HASH,
	payload:  hash
});

module.exports.setIsBlockedSync = (bool) => ({
	type: SET_IS_BLOCKED_SYNC,
	payload:  bool
});

module.exports.setIsUploadConfirmed = (bool) => ({
	type: SET_IS_UPLOAD_CONFIRMED,
	payload:  bool
});

module.exports.addFileLocation = (file) => ({
	type: ADD_FILE_LOCATION,
	payload: file
});

module.exports.addRegisteredFile = () => ({
	type: ADD_REGISTERED_FILE
});

module.exports.addNewFile = (file) => ({
	type: ADD_NEW_FILE,
	payload: file
});

module.exports.addNewVersion = (file) => ({
	type: ADD_NEW_VERSION,
	payload: file
});

module.exports.addScannedFolder = (dir) => ({
	type: ADD_SCANNED_FOLDER,
	payload: dir
});

module.exports.removeLocation = (file) => ({
	type: REMOVE_LOCATION,
	payload: file
});

module.exports.increaseScannedFolders = () => ({
	type: INCREASE_SCANNED_FOLDERS,
	payload: null
});

module.exports.increaseScannedFiles = (file) => ({
	type: INCREASE_SCANNED_FILES,
	payload: file
});

module.exports.increaseNewFiles = () => ({
	type: INCREASE_NEW_FILES,
	payload: null
});

module.exports.increaseNewFilesSize = (value) => ({
	type: INCREASE_NEW_FILES_SIZE,
	payload: value
});

module.exports.setDefaultSyncState = () => ({
	type: SET_DEFAULT_SYNC_STATE,
	payload: null
});

