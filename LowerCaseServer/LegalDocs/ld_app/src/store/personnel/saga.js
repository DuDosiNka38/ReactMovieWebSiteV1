import { all, call, fork, takeEvery, put } from "redux-saga/effects";
import * as PersonnelActions from "./actions";
import * as PreloaderActions from "./../preloader/actions";
import UserApi from "../../api/UserApi";
import { PERSONNEL_FETCH_REQUESTED, ROLES_FETCH_REQUESTED } from "./actionTypes";

function* fetchPersonnel(action) {
  try {
    yield put(PreloaderActions.showPreloader("fetchPersonnel"));
    const personnel = yield call(UserApi.fetchAllPersons);
    yield put(PersonnelActions.personnelFetchSucceeded(personnel));
  } catch (e) {
    yield put(PersonnelActions.personnelFetchFailed(e.message));
  } finally {
    yield put(PreloaderActions.hidePreloader("fetchPersonnel"));
  }
}

function* fetchRoles(action) {
  try {
    yield put(PreloaderActions.showPreloader("fetchRoles"));
    const Roles = yield call(UserApi.fetchRoles);
    yield put(PersonnelActions.rolesFetchSucceeded(Roles));
  } catch (e) {
    yield put(PersonnelActions.rolesFetchFailed(e.message));
  } finally {
    yield put(PreloaderActions.hidePreloader("fetchRoles"));
  }
}

function* PersonnelSaga() {
  yield takeEvery(PERSONNEL_FETCH_REQUESTED, fetchPersonnel);
  yield takeEvery(ROLES_FETCH_REQUESTED, fetchRoles);
}

export default PersonnelSaga;
