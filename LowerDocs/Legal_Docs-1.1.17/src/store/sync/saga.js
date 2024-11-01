import { all, call, fork, takeEvery, put } from "redux-saga/effects";

import { Get_Sync_Data, Get_Sync_Info } from "./actionTypes";
import { setSyncData, setSyncInfo } from "./actions";

function* axiosDataAsync() {
  try {
    yield put(setSyncData({action: null}))
    yield put(setSyncInfo({huy: "na masle"}))    
  } catch (error) {
   console.log(error);
  }
}

function* watchAxiosData() {
  yield takeEvery (Get_Sync_Data, axiosDataAsync);
  yield takeEvery (Get_Sync_Info, axiosDataAsync);
}

function* SyncDataSaga() {
  yield all([fork(watchAxiosData)]);
}

export default SyncDataSaga;
