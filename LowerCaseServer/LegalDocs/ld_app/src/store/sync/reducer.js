import { ADD_SYNC_SHARE_PERSON_FAILED, ADD_SYNC_SHARE_PERSON_REQUESTED, ADD_SYNC_SHARE_PERSON_SUCCEEDED, PARSING_STEPS_FETCH_FAILED, PARSING_STEPS_FETCH_REQUESTED, PARSING_STEPS_FETCH_SUCCEEDED, REMOVE_SYNC_SCHEDULE_FAILED, REMOVE_SYNC_SCHEDULE_REQUESTED, REMOVE_SYNC_SCHEDULE_SUCCEEDED, REMOVE_SYNC_SHARE_PERSON_FAILED, REMOVE_SYNC_SHARE_PERSON_REQUESTED, REMOVE_SYNC_SHARE_PERSON_SUCCEEDED, SET_SYNC_PROCESS, SET_SYNC_SCHEDULE_FETCH_FAILED, SET_SYNC_SCHEDULE_FETCH_REQUESTED, SET_SYNC_SCHEDULE_FETCH_SUCCEEDED, SYNC_SCHEDULE_FETCH_FAILED, SYNC_SCHEDULE_FETCH_REQUESTED, SYNC_SCHEDULE_FETCH_SUCCEEDED, SYNC_SHARED_PERSONS_FETCH_FAILED, SYNC_SHARED_PERSONS_FETCH_REQUESTED, SYNC_SHARED_PERSONS_FETCH_SUCCEEDED, SYNC_SHARE_FETCH_FAILED, SYNC_SHARE_FETCH_REQUESTED, SYNC_SHARE_FETCH_SUCCEEDED } from "./actionTypes";
import { addSyncSharePersonFailed, addSyncSharePersonRequested, parsingStepsFailed, parsingStepsRequested, parsingStepsSucceeded, removeSyncScheduleFailed, removeSyncScheduleRequested, removeSyncScheduleSucceded, removeSyncSharePersonFailed, removeSyncSharePersonRequested, removeSyncSharePersonSucceded, setSyncProcess, setSyncScheduleFailed, setSyncScheduleRequested, syncScheduleFailed, syncScheduleRequested, syncScheduleSucceeded, syncSharedPersonsFailed, syncSharedPersonsRequested, syncSharedPersonsSucceeded, syncShareFailed, syncShareRequested, syncShareSucceeded } from "./functions/sync";

const INIT_STATE = {
  syncShare: [],
  syncSchedule: [],
  Upload_Files: [],

  Shared_Persons: [],
  Parsing_Steps: [],

  process: {
    action: null,
    data: {},
  },

  loading: false,
  isInit: false,
  error: false,
  message: null,
};

const Sync = (state = INIT_STATE, action) => {
  switch (action.type) {
    case SYNC_SHARE_FETCH_REQUESTED: return syncShareRequested(state, action);
    case SYNC_SHARE_FETCH_SUCCEEDED: return syncShareSucceeded(state, action); 
    case SYNC_SHARE_FETCH_FAILED: return syncShareFailed(state, action); 

    case SYNC_SHARED_PERSONS_FETCH_REQUESTED: return syncSharedPersonsRequested(state, action);
    case SYNC_SHARED_PERSONS_FETCH_SUCCEEDED: return syncSharedPersonsSucceeded(state, action); 
    case SYNC_SHARED_PERSONS_FETCH_FAILED: return syncSharedPersonsFailed(state, action); 

    case ADD_SYNC_SHARE_PERSON_REQUESTED: return setSyncScheduleRequested(state, action); 
    case ADD_SYNC_SHARE_PERSON_SUCCEEDED: return syncShareSucceeded(state, action); 
    case ADD_SYNC_SHARE_PERSON_FAILED: return setSyncScheduleFailed(state, action); 

    case REMOVE_SYNC_SHARE_PERSON_REQUESTED: return removeSyncSharePersonRequested(state, action); 
    case REMOVE_SYNC_SHARE_PERSON_SUCCEEDED: return removeSyncSharePersonSucceded(state, action); 
    case REMOVE_SYNC_SHARE_PERSON_FAILED: return removeSyncSharePersonFailed(state, action); 

    case SYNC_SCHEDULE_FETCH_REQUESTED: return syncScheduleRequested(state, action);
    case SYNC_SCHEDULE_FETCH_SUCCEEDED: return syncScheduleSucceeded(state, action); 
    case SYNC_SCHEDULE_FETCH_FAILED: return syncScheduleFailed(state, action); 

    case SET_SYNC_SCHEDULE_FETCH_REQUESTED: return setSyncScheduleRequested(state, action);
    case SET_SYNC_SCHEDULE_FETCH_SUCCEEDED: return syncScheduleSucceeded(state, action); 
    case SET_SYNC_SCHEDULE_FETCH_FAILED: return setSyncScheduleFailed(state, action); 

    case REMOVE_SYNC_SCHEDULE_REQUESTED: return removeSyncScheduleRequested(state, action); 
    case REMOVE_SYNC_SCHEDULE_SUCCEEDED: return removeSyncScheduleSucceded(state, action); 
    case REMOVE_SYNC_SCHEDULE_FAILED: return removeSyncScheduleFailed(state, action); 

    case PARSING_STEPS_FETCH_REQUESTED: return parsingStepsRequested(state, action); 
    case PARSING_STEPS_FETCH_SUCCEEDED: return parsingStepsSucceeded(state, action); 
    case PARSING_STEPS_FETCH_FAILED: return parsingStepsFailed(state, action); 

    case SET_SYNC_PROCESS: return setSyncProcess(state, action);
      
    default:
      return state;
  }
};

export default Sync;
