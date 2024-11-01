import { all, call, fork, takeEvery, put } from "redux-saga/effects";
import * as UserActions from "./actions";
import * as PreloaderActions from "./../preloader/actions";
import { USER_FETCH_REQUESTED } from "./actionTypes";
import axios from "../../services/axios";
import UserApi from "../../api/UserApi";

function* fetchUser(action) {
    try {
      yield put(PreloaderActions.showPreloader("fetchUser"));
      const user = yield call(UserApi.fetchUser);
      if (user.result) {
        yield put(UserActions.userFetchSucceeded(user.data));
      } else {
        yield put(UserActions.userFetchFailed(user.data.error_message));
      }
    } catch (e) {
      yield put(UserActions.userFetchFailed(e.message));
    } finally {
      yield put(PreloaderActions.hidePreloader("fetchUser"));
    }
}

function* UserSaga() {
    yield takeEvery(USER_FETCH_REQUESTED, fetchUser);
}

export default UserSaga;
