import { all, call, fork, takeEvery, put } from "redux-saga/effects";
import * as SyncActions from "./actions";
import * as PreloaderActions from "./../preloader/actions";
import SyncApi from "../../api/SyncApi";
import { ADD_SYNC_SHARE_PERSON_REQUESTED, PARSING_STEPS_FETCH_REQUESTED, REMOVE_SYNC_SCHEDULE_REQUESTED, REMOVE_SYNC_SHARE_PERSON_REQUESTED, SET_SYNC_SCHEDULE_FETCH_REQUESTED, SYNC_SCHEDULE_FETCH_REQUESTED, SYNC_SHARED_PERSONS_FETCH_REQUESTED, SYNC_SHARE_FETCH_REQUESTED } from "./actionTypes";

function* fetchSyncShare(action) {
  try {
    yield put(PreloaderActions.showPreloader("fetchSyncShare"));
    const syncShare = yield call(SyncApi.fetchSyncShare, action.payload);
    yield put(SyncActions.syncShareFetchSucceeded(syncShare));
  } catch (e) {
    yield put(SyncActions.syncShareFetchFailed(e.message));
  } finally {
    yield put(PreloaderActions.hidePreloader("fetchSyncShare"));
  }
}

function* fetchSyncSharedPersons(action) {
  try {
    yield put(PreloaderActions.showPreloader("fetchSyncSharedPersons"));
    const syncShare = yield call(SyncApi.fetchSyncSharedPersons, action.payload);
    yield put(SyncActions.syncSharedPersonsFetchSucceeded(syncShare));
  } catch (e) {
    yield put(SyncActions.addSyncSharePersonFailed(e.message));
  } finally {
    yield put(PreloaderActions.hidePreloader("fetchSyncSharedPersons"));
  }
}

function* addSyncSharePerson(action) {
  try {
    yield put(PreloaderActions.showPreloader("addSyncSharePerson"));
    const response = yield call(SyncApi.insertSyncSharePersons, action.payload);
    if(response.result)
      yield put(SyncActions.addSyncSharePersonSucceded(response.data));
  } catch (e) {
    yield put(SyncActions.addSyncSharePersonFailed(e.message));
  } finally {
    yield put(PreloaderActions.hidePreloader("addSyncSharePerson"));
  }
}

function* removeSyncSharePerson(action) {
  try {
    yield put(PreloaderActions.showPreloader("removeSyncSharePerson"));
    const response = yield call(SyncApi.deleteSyncSharePerson, action.payload);
    if(response.result)
      yield put(SyncActions.removeSyncSharePersonSucceded(action.payload));
  } catch (e) {
    yield put(SyncActions.removeSyncSharePersonFailed(e.message));
  } finally {
    yield put(PreloaderActions.hidePreloader("removeSyncSharePerson"));
  }
}

function* fetchSyncSchedule(action) {
  try {
    yield put(PreloaderActions.showPreloader("fetchSyncSchedule"));
    const syncSchedule = yield call(SyncApi.fetchSyncSchedule, action.payload);
    yield put(SyncActions.syncScheduleFetchSucceeded(syncSchedule));
  } catch (e) {
    yield put(SyncActions.syncScheduleFetchFailed(e.message));
  } finally {
    yield put(PreloaderActions.hidePreloader("fetchSyncSchedule"));
  }
}

function* setSyncSchedule(action) {
  try {
    yield put(PreloaderActions.showPreloader("setSyncSchedule"));
    const response = yield call(SyncApi.insertSyncSchedule, action.payload);
    if(response.result)
      yield put(SyncActions.syncScheduleFetchSucceeded(response.data));
  } catch (e) {
    yield put(SyncActions.setSyncScheduleFetchFailed(e.message));
  } finally {
    yield put(PreloaderActions.hidePreloader("setSyncSchedule"));
  }
}

function* removeSyncSchedule(action) {
  try {
    yield put(PreloaderActions.showPreloader("removeSyncSchedule"));
    const response = yield call(SyncApi.deleteSyncSchedule, action.payload);
    if(response.result)
      yield put(SyncActions.removeSyncScheduleSucceded(action.payload));
  } catch (e) {
    yield put(SyncActions.removeSyncScheduleFailed(e.message));
  } finally {
    yield put(PreloaderActions.hidePreloader("removeSyncSchedule"));
  }
}

function* fetchParsingSteps(action) {
  try {
    yield put(PreloaderActions.showPreloader("fetchParsingSteps"));
    const ParsingSteps = yield call(SyncApi.fetchParsingSteps);
    yield put(SyncActions.parsingStepsFetchSucceeded(ParsingSteps));
  } catch (e) {
    yield put(SyncActions.parsingStepsFetchFailed(e.message));
  } finally {
    yield put(PreloaderActions.hidePreloader("fetchParsingSteps"));
  }
}

function* SyncSaga() {
  yield takeEvery(SYNC_SHARE_FETCH_REQUESTED, fetchSyncShare);
  yield takeEvery(SYNC_SHARED_PERSONS_FETCH_REQUESTED, fetchSyncSharedPersons);
  yield takeEvery(ADD_SYNC_SHARE_PERSON_REQUESTED, addSyncSharePerson);
  yield takeEvery(REMOVE_SYNC_SHARE_PERSON_REQUESTED, removeSyncSharePerson);

  yield takeEvery(SET_SYNC_SCHEDULE_FETCH_REQUESTED, setSyncSchedule);
  yield takeEvery(SYNC_SCHEDULE_FETCH_REQUESTED, fetchSyncSchedule);
  yield takeEvery(REMOVE_SYNC_SCHEDULE_REQUESTED, removeSyncSchedule);

  yield takeEvery(PARSING_STEPS_FETCH_REQUESTED, fetchParsingSteps);
}

export default SyncSaga;
