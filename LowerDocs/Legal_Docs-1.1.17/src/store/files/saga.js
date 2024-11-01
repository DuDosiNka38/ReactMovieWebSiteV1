import { all, call, fork, takeEvery, put } from "redux-saga/effects";
import axios from "./../../services/axios";
import Core from "./../../electron/services/core";

import { Get_Files } from "./actionTypes";
import { requestedFiles } from "./actions";
import { ipcRenderer } from "electron";

function* axiosDataAsync() {
  try {
    const data = yield call(() => {
      return axios
        .post("/api/user/get_data", { hash: Core.getHash() })
        .then(function (response) {
          return response;
        });
    });
    if (data.data.hasOwnProperty("result") && data.data.result === false) {
      yield put(requestedFiles(data));
    }
  } catch (error) {
   console.log(error);
  }
}

function* watchAxiosData() {
  yield takeEvery (Get_Files, axiosDataAsync);
}

function* FileSaga() {
  yield all([fork(watchAxiosData)]);
}

export default FileSaga;
