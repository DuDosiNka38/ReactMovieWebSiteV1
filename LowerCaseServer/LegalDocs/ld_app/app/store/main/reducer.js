const { SET_AUTH_HASH, SET_SYSTEM_INFO, SET_IS_BLOCKED_SYNC, ADD_FILE_LOCATION, ADD_NEW_VERSION, REMOVE_LOCATION, INCREASE_SCANNED_FILES, ADD_NEW_FILE, INCREASE_SCANNED_FOLDERS, SET_DEFAULT_SYNC_STATE, INCREASE_NEW_FILES, INCREASE_NEW_FILES_SIZE, ADD_SCANNED_FOLDER, SET_IS_UPLOAD_CONFIRMED, ADD_REGISTERED_FILE } = require('./actionTypes');
const { addFileLoc, addNewVer, removeLocation, increaseScannedFolders, increaseScannedFiles, addNewFile, increaseNewFiles, increaseNewFilesSize, addScannedFolder, addRegisteredLoc } = require('./functions/SyncFn');

const DEFAULT_SYNC_STATE = {
  isBlocked: false,
  isUploadConfirmed: null,
  Add_Locations: [],
  New_Files: [],
  Registered_Locations: 0,
  New_Locations: [],
  New_Versions: [],
  Remove_Locations: [],
  Scanned_Folders: [],
  Total_Scanned_Folders: 0,
  Total_Scanned_Files: 0,
  Total_Scanned_Files_Size: 0,
  Start_Scan_Timestamp: null,
  duplicateFiles: 0,

  Total_New_Files: 0,
  Total_New_Files_Size: 0,

  New_Files_Max_Size: 0,
  New_Files_Min_Size: 0
};

const INIT_STATE = {
  system: {},
  Sync: {...DEFAULT_SYNC_STATE},
	auth_hash: undefined,
};

const Main = (state = INIT_STATE, action) => {
	switch (action.type) {
		case SET_SYSTEM_INFO:
			return {
				...state,
				system: action.payload
			};
    case SET_AUTH_HASH:
      return {
        ...state,
        auth_hash: action.payload
      };
		case SET_IS_BLOCKED_SYNC:
			return {
				...state,
				Sync: {...state.Sync, isBlocked: action.payload}
			};
		case SET_IS_UPLOAD_CONFIRMED:
			return {
				...state,
				Sync: {...state.Sync, isUploadConfirmed: action.payload}
			};
    
    case ADD_FILE_LOCATION: return addFileLoc(state, action);
    case ADD_REGISTERED_FILE: return addRegisteredLoc(state, action);
    case ADD_NEW_FILE: return addNewFile(state, action);
    case ADD_NEW_VERSION: return addNewVer(state, action);
    case ADD_SCANNED_FOLDER: return addScannedFolder(state, action);
    case REMOVE_LOCATION: return removeLocation(state, action);

    case INCREASE_SCANNED_FOLDERS: return increaseScannedFolders(state, action);
    case INCREASE_SCANNED_FILES: return increaseScannedFiles(state, action);
    case INCREASE_NEW_FILES: return increaseNewFiles(state, action);
    case INCREASE_NEW_FILES_SIZE: return increaseNewFilesSize(state, action);

    case SET_DEFAULT_SYNC_STATE:
      return {
        ...state,
        Sync: {...DEFAULT_SYNC_STATE}
      }

		default:
			return state;
	}
};

module.exports = Main;
