import {
  ADD_SYNC_SHARE_PERSON_FAILED,
  ADD_SYNC_SHARE_PERSON_REQUESTED,
  ADD_SYNC_SHARE_PERSON_SUCCEEDED,
  PARSING_STEPS_FETCH_FAILED,
  PARSING_STEPS_FETCH_REQUESTED,
  PARSING_STEPS_FETCH_SUCCEEDED,
  REMOVE_SYNC_SCHEDULE_FAILED,
  REMOVE_SYNC_SCHEDULE_REQUESTED,
  REMOVE_SYNC_SCHEDULE_SUCCEEDED,
  REMOVE_SYNC_SHARE_PERSON_FAILED,
  REMOVE_SYNC_SHARE_PERSON_REQUESTED,
  REMOVE_SYNC_SHARE_PERSON_SUCCEEDED,
  SET_SYNC_PROCESS,
  SET_SYNC_SCHEDULE_FETCH_FAILED,
  SET_SYNC_SCHEDULE_FETCH_REQUESTED,
  SET_SYNC_SCHEDULE_FETCH_SUCCEEDED,
  SYNC_SCHEDULE_FETCH_FAILED,
  SYNC_SCHEDULE_FETCH_REQUESTED,
  SYNC_SCHEDULE_FETCH_SUCCEEDED,
  SYNC_SHARED_PERSONS_FETCH_FAILED,
  SYNC_SHARED_PERSONS_FETCH_REQUESTED,
  SYNC_SHARED_PERSONS_FETCH_SUCCEEDED,
  SYNC_SHARE_FETCH_FAILED,
  SYNC_SHARE_FETCH_REQUESTED,
  SYNC_SHARE_FETCH_SUCCEEDED,
} from "./actionTypes";

//syncShare ALL
export const syncShareFetchRequested = (Person_id) => ({
  type: SYNC_SHARE_FETCH_REQUESTED,
  payload: Person_id,
});
export const syncShareFetchSucceeded = (data) => ({
  type: SYNC_SHARE_FETCH_SUCCEEDED,
  payload: data,
});
export const syncShareFetchFailed = (eMessage) => ({
  type: SYNC_SHARE_FETCH_FAILED,
  payload: eMessage,
});

export const syncSharedPersonsFetchRequested = (Person_id) => ({
  type: SYNC_SHARED_PERSONS_FETCH_REQUESTED,
  payload: Person_id,
});
export const syncSharedPersonsFetchSucceeded = (data) => ({
  type: SYNC_SHARED_PERSONS_FETCH_SUCCEEDED,
  payload: data,
});
export const syncSharedPersonsFetchFailed = (eMessage) => ({
  type: SYNC_SHARED_PERSONS_FETCH_FAILED,
  payload: eMessage,
});

//add sync share persons
export const addSyncSharePersonRequested = (persons) => ({
  type: ADD_SYNC_SHARE_PERSON_REQUESTED,
  payload: persons,
});
export const addSyncSharePersonSucceded = (persons) => ({
  type: ADD_SYNC_SHARE_PERSON_SUCCEEDED,
  payload: persons,
});
export const addSyncSharePersonFailed = (eMessage) => ({
  type: ADD_SYNC_SHARE_PERSON_FAILED,
  payload: eMessage,
});

//remove sync share row
export const removeSyncSharePersonRequested = (Share_to_Person_id) => ({
  type: REMOVE_SYNC_SHARE_PERSON_REQUESTED,
  payload: Share_to_Person_id,
});
export const removeSyncSharePersonSucceded = (Share_to_Person_id) => ({
  type: REMOVE_SYNC_SHARE_PERSON_SUCCEEDED,
  payload: Share_to_Person_id,
});
export const removeSyncSharePersonFailed = (eMessage) => ({
  type: REMOVE_SYNC_SHARE_PERSON_FAILED,
  payload: eMessage,
});

//syncSchedule ALL
export const syncScheduleFetchRequested = (Person_id) => ({
  type: SYNC_SCHEDULE_FETCH_REQUESTED,
  payload: Person_id,
});
export const syncScheduleFetchSucceeded = (data) => ({
  type: SYNC_SCHEDULE_FETCH_SUCCEEDED,
  payload: data,
});
export const syncScheduleFetchFailed = (eMessage) => ({
  type: SYNC_SCHEDULE_FETCH_FAILED,
  payload: eMessage,
});

//syncSchedule set
export const setSyncScheduleFetchRequested = (data) => ({
  type: SET_SYNC_SCHEDULE_FETCH_REQUESTED,
  payload: data,
});
export const setSyncScheduleFetchSucceeded = (data) => ({
  type: SET_SYNC_SCHEDULE_FETCH_SUCCEEDED,
  payload: data,
});
export const setSyncScheduleFetchFailed = (eMessage) => ({
  type: SET_SYNC_SCHEDULE_FETCH_FAILED,
  payload: eMessage,
});

//remove sync share row
export const removeSyncScheduleRequested = (Row_id) => ({
  type: REMOVE_SYNC_SCHEDULE_REQUESTED,
  payload: Row_id,
});
export const removeSyncScheduleSucceded = (Row_id) => ({
  type: REMOVE_SYNC_SCHEDULE_SUCCEEDED,
  payload: Row_id,
});
export const removeSyncScheduleFailed = (eMessage) => ({
  type: REMOVE_SYNC_SCHEDULE_FAILED,
  payload: eMessage,
});

//syncShare ALL
export const parsingStepsFetchRequested = (Person_id) => ({
  type: PARSING_STEPS_FETCH_REQUESTED,
  payload: Person_id,
});
export const parsingStepsFetchSucceeded = (data) => ({
  type: PARSING_STEPS_FETCH_SUCCEEDED,
  payload: data,
});
export const parsingStepsFetchFailed = (eMessage) => ({
  type: PARSING_STEPS_FETCH_FAILED,
  payload: eMessage,
});

//SYNC PROCESS
export const setSyncProcess = (data) => ({
  type: SET_SYNC_PROCESS,
  payload: data,
});
