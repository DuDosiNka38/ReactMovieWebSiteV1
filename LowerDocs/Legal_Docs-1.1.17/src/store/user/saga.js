import { all, call, fork, takeEvery, put } from "redux-saga/effects";
import axios from "./../../services/axios";
import Core from "./../../electron/services/core";

// import api from "./../../services/api"
import {
  changePreloader
} from './../layout/actions'
import {
  GetCase,
  GetDepartment,
  GetCaseType,
  // GetPerson,
  GetGlobalData,
  getAllUsersData,
  GetParticipantRoles,
  getUserRoles,
  getCalendars,
  getRelationType,
  getAllEvents,
  getCaseStatus,
  // getAllAlerts,
  getAllTodos,
  getPrviliges,
  getRolePrviliges,
  getActivityTypes,
  getSettings,
  getKeywords,
  getStaff,
  getGlobalKeywords,
  getSYNCHRONIZATIONData,
} from "./actionTypes";
import {
  requestCaseSuccess,
  requestDepartmentsSuccess,
  requestCaseTypesSucsess,
  requestError,
  requestPersonDataSuccess,
  requestParticipantRolesSuccess,
  requestGlobalData,
  // setLocalDocuments,
  chekUserLogged,
  chekUseCheck,
  chekMountData,
  requestAllUsersData,
  requestUserRoles,
  requestCalendars,
  requestRelationType,
  requestAllEvents,
  requestCaseStatus,
  requestAllAlerts,
  requestAllTodo,
  requestActivityType,
  requestPreviliges,
  requestRolePreviliges,
  requestSettings,
  requestKeywords,
  requestStaff,
  requestGlobalKeywords,
  
} from "./actions";

function* axiosDataAsync() {
  try {
    const data = yield call(() => {
      return axios
        .post("/api/user/get_data",{hash: Core.getHash()}
        // {test: true}
        )
        .then(function (response) {
          const {status, statusText} = response;
          // console.log(status, statusText);
          // switch(status){
          //   case 200:
          //     console.log("Server responds successfully!")
          //     break;
          //   case 500, 502:
          //     console.log("Bad request!");
          //     break;

          //   case 504:
          //     console.log("Server is not respond!")
          //     break;

          //   default:
          //     console.log(`${status}:${statusText}`);
          //     break;
          // }
          return response;
        }).catch(r => console.log(r));
    });
    if (data.data.hasOwnProperty("result") && data.data.result === false) {
      yield put(changePreloader(true))
      yield put(chekUserLogged(false));
      yield put(chekUseCheck(true));
      yield put(chekMountData(true));
      yield put(changePreloader(false))
    } else {
      yield put(changePreloader(true))
      yield put(chekUserLogged(true));
      yield put(chekUseCheck(true));
      yield put(chekMountData(true));
      yield put(requestGlobalData(data));
      yield put(requestCaseSuccess(data));
      yield put(requestDepartmentsSuccess(data));
      yield put(requestCaseTypesSucsess(data));
      yield put(requestPersonDataSuccess(data));
      yield put(requestParticipantRolesSuccess(data));
      yield put(requestAllUsersData(data));
      yield put(requestUserRoles(data));
      yield put(requestCalendars(data));
      yield put(requestRelationType(data));
      yield put(requestAllEvents(data));
      yield put(requestCaseStatus(data));
      yield put(requestAllTodo(data));
      yield put(requestAllAlerts(data));
      yield put(requestRolePreviliges(data));
      yield put(requestPreviliges(data));
      yield put(requestActivityType(data));
      yield put(requestSettings(data));
      yield put(requestKeywords(data));
      yield put(requestStaff(data));
      yield put(requestGlobalKeywords(data));

      // yield put(setLocalDocuments(data));
      // yield put(changePreloader(false))
      yield put(changePreloader(false))

    }
    // yield put(changePreloader(true))
    // yield put(requestGlobalData(data));
    // yield put(requestCaseSuccess(data));
    // yield put(requestDepartmentsSuccess(data));
    // yield put(requestCaseTypesSucsess(data));
    // yield put(requestPersonDataSuccess(data));
    // yield put(requestParticipantRolesSuccess(data));
    // yield put(requestAllUsersData(data));
    // yield put(requestUserRoles(data));
    // // yield put(setLocalDocuments(data));
    // yield put(changePreloader(false))

  } catch (error) {
    yield put(requestError());
  }
}

function* watchAxiosData() {
  yield takeEvery(GetGlobalData, axiosDataAsync);
  yield takeEvery(GetCase, axiosDataAsync);
  yield takeEvery(GetDepartment, axiosDataAsync);
  yield takeEvery(GetCaseType, axiosDataAsync);
  yield takeEvery(getAllUsersData, axiosDataAsync);
  yield takeEvery(GetParticipantRoles, axiosDataAsync);
  yield takeEvery(getUserRoles, axiosDataAsync);
  yield takeEvery(getCalendars, axiosDataAsync);
  yield takeEvery(getRelationType, axiosDataAsync);
  yield takeEvery(getAllEvents, axiosDataAsync);
  yield takeEvery(getCaseStatus, axiosDataAsync);
  yield takeEvery(getAllTodos, axiosDataAsync);
  yield takeEvery(getRolePrviliges, axiosDataAsync);
  yield takeEvery(getPrviliges, axiosDataAsync);
  yield takeEvery(getActivityTypes, axiosDataAsync);
  yield takeEvery(getSettings, axiosDataAsync);
  yield takeEvery(getKeywords, axiosDataAsync);
  yield takeEvery(getStaff, axiosDataAsync);
  yield takeEvery(getGlobalKeywords, axiosDataAsync);
}

// function* watchDepartments() {
//   yield takeEvery( GetDepartment, axiosDataAsync);
// }
function* UserSaga() {
  yield all([fork(watchAxiosData)]);
}

export default UserSaga;
