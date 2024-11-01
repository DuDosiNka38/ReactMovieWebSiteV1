import { all, call, fork, takeEvery, put } from "redux-saga/effects";
import * as CaseActions from "./actions";
import * as PreloaderActions from "./../preloader/actions";
import { ADD_CALENDAR_REQUESTED, ADD_DEPARTMENT_REQUESTED, ALL_CASES_FETCH_REQUESTED, CALENDARS_FETCH_REQUESTED, CASE_PARTICIPANTS_FETCH_REQUESTED, CASE_ROLES_FETCH_REQUESTED, CASE_SIDES_FETCH_REQUESTED, CASE_TYPES_FETCH_REQUESTED, DELETE_CALENDAR_REQUESTED, DELETE_DEPARTMENT_REQUESTED, DEPARTMENTS_FETCH_REQUESTED, UPDATE_CALENDAR_REQUESTED, UPDATE_DEPARTMENT_REQUESTED, USER_CASES_FETCH_REQUESTED, USER_SINGLE_CASE_FETCH_REQUESTED } from "./actionTypes";
import axios from "./../../services/axios";
import CaseApi from "./../../api/CaseApi";
import CalendarsApi from "../../api/CalendarsApi";

function* fetchAllCases(action) {
  try {
    yield put(PreloaderActions.showPreloader("fetchAllCases"));
    const allCases = yield call(CaseApi.fetchAllCases);
    yield put(CaseActions.allCasesFetchSucceeded(allCases));
  } catch (e) {
    yield put(CaseActions.allCasesFetchFailed(e.message));
  } finally {
    yield put(PreloaderActions.hidePreloader("fetchAllCases"));
  }
}

function* fetchCases(action) {
  try {
    yield put(PreloaderActions.showPreloader("fetchCases"));
    const userCases = yield call(CaseApi.fetchUserCases);
    yield put(CaseActions.userCasesFetchSucceeded(userCases));
  } catch (e) {
    yield put(CaseActions.userCasesFetchFailed(e.message));
  } finally {
    yield put(PreloaderActions.hidePreloader("fetchCases"));
  }
}

function* fetchCase(action) {
    try {
      yield put(PreloaderActions.showPreloader("fetchCase"));
      const userCase = yield call(CaseApi.fetchSingleCase, action.payload);
      yield put(CaseActions.userSingleCaseFetchSucceeded(userCase));
    } catch (e) {
      yield put(CaseActions.userSingleCaseFetchFailed(e.message));
    } finally {
      yield put(PreloaderActions.hidePreloader("fetchCase"));
    }
}

function* fetchCaseParticipants(action) {
    try {
      yield put(PreloaderActions.showPreloader("fetchCaseParticipants"));
      const caseParticipants = yield call(CaseApi.fetchCaseParticipants, action.payload);
      yield put(CaseActions.caseParticipantsFetchSucceeded({caseParticipants:caseParticipants, Case_NAME: action.payload}));
    } catch (e) {
      yield put(CaseActions.caseParticipantsFetchFailed(e.message));
    } finally {
      yield put(PreloaderActions.hidePreloader("fetchCaseParticipants"));
    }
}

function* fetchCaseTypes(action) {
    try {
      yield put(PreloaderActions.showPreloader("fetchCaseTypes"));
      const caseTypes = yield call(CaseApi.fetchCaseTypes);
      yield put(CaseActions.caseTypesFetchSucceeded(caseTypes));
    } catch (e) {
      yield put(CaseActions.caseTypesFetchFailed(e.message));
    } finally {
      yield put(PreloaderActions.hidePreloader("fetchCaseTypes"));
    }
}

function* fetchCaseRoles(action) {
    try {
      yield put(PreloaderActions.showPreloader("fetchCaseRoles"));
      const fetchCaseRoles = yield call(CaseApi.fetchCaseRoles);
      yield put(CaseActions.caseRolesFetchSucceeded(fetchCaseRoles));
    } catch (e) {
      yield put(CaseActions.caseRolesFetchFailed(e.message));
    } finally {
      yield put(PreloaderActions.hidePreloader("fetchCaseRoles"));
    }
}

function* fetchCaseSides(action) {
    try {
      yield put(PreloaderActions.showPreloader("fetchCaseSides"));
      const fetchCaseRoles = yield call(CaseApi.fetchCaseSides);
      yield put(CaseActions.caseSidesFetchSucceeded(fetchCaseRoles));
    } catch (e) {
      yield put(CaseActions.caseSidesFetchFailed(e.message));
    } finally {
      yield put(PreloaderActions.hidePreloader("fetchCaseSides"));
    }
}

function* fetchDepartments(action) {
    try {
      yield put(PreloaderActions.showPreloader("fetchDepartments"));
      const departments = yield call(CaseApi.fetchDepartments);
      yield put(CaseActions.departmentsFetchSucceeded(departments));
    } catch (e) {
      yield put(CaseActions.departmentsFetchFailed(e.message));
    } finally {
      yield put(PreloaderActions.hidePreloader("fetchDepartments"));
    }
}

function* addDepartment(action) {
    try {
      yield put(PreloaderActions.showPreloader("addDepartment"));
      const response = yield call(CaseApi.postDepartment, action.payload);
      if(response)
        yield put(CaseActions.addDepartmentSucceded(response));
    } catch (e) {
      yield put(CaseActions.addDepartmentFailed(e.message));
    } finally {
      yield put(PreloaderActions.hidePreloader("addDepartment"));
    }
}

function* updateDepartment(action) {
    try {
      yield put(PreloaderActions.showPreloader("updateDepartment"));
      const response = yield call(CaseApi.putDepartment, action.payload.Department_id, action.payload);
      if(response)
        yield put(CaseActions.updateDepartmentSucceeded(response));
    } catch (e) {
      yield put(CaseActions.updateDepartmentFailed(e.message));
    } finally {
      yield put(PreloaderActions.hidePreloader("updateDepartment"));
    }
}

function* deleteDepartment(action) {
    try {
      yield put(PreloaderActions.showPreloader("deleteDepartment"));
      const response = yield call(CaseApi.deleteDepartment, action.payload);
      if(response)
        yield put(CaseActions.deleteDepartmentSucceded(action.payload));
    } catch (e) {
      yield put(CaseActions.deleteDepartmentFailed(e.message));
    } finally {
      yield put(PreloaderActions.hidePreloader("deleteDepartment"));
    }
}

function* fetchCalendars(action) {
  try {
    yield put(PreloaderActions.showPreloader("fetchCalendars"));
    const calendars = yield call(CalendarsApi.fetchCalendars);
    yield put(CaseActions.calendarsFetchSucceeded(calendars));
  } catch (e) {
    yield put(CaseActions.calendarsFetchFailed(e.message));
  } finally {
    yield put(PreloaderActions.hidePreloader("fetchCalendars"));
  }
}

function* addCalendar(action) {
  try {
    yield put(PreloaderActions.showPreloader("addCalendar"));
    const response = yield call(CalendarsApi.postCalendar, action.payload);
    if(response)
      yield put(CaseActions.addCalendarSucceded(response));
  } catch (e) {
    yield put(CaseActions.addCalendarFailed(e.message));
  } finally {
    yield put(PreloaderActions.hidePreloader("addCalendar"));
  }
}

function* updateCalendar(action) {
  try {
    yield put(PreloaderActions.showPreloader("updateCalendar"));
    const response = yield call(CalendarsApi.putCalendar, action.payload.Calendar_name, action.payload);
    if(response)
      yield put(CaseActions.updateCalendarSucceeded(response));
  } catch (e) {
    yield put(CaseActions.updateCalendarFailed(e.message));
  } finally {
    yield put(PreloaderActions.hidePreloader("updateCalendar"));
  }
}

function* deleteCalendar(action) {
  try {
    yield put(PreloaderActions.showPreloader("deleteCalendar"));
    const response = yield call(CalendarsApi.deleteCalendar, action.payload);
    if(response)
      yield put(CaseActions.deleteCalendarSucceded(action.payload));
  } catch (e) {
    yield put(CaseActions.deleteCalendarFailed(e.message));
  } finally {
    yield put(PreloaderActions.hidePreloader("deleteCalendar"));
  }
}

function* CaseSaga() {
    yield takeEvery(ALL_CASES_FETCH_REQUESTED, fetchAllCases);
    yield takeEvery(USER_CASES_FETCH_REQUESTED, fetchCases);
    yield takeEvery(USER_SINGLE_CASE_FETCH_REQUESTED, fetchCase);
    yield takeEvery(CASE_PARTICIPANTS_FETCH_REQUESTED, fetchCaseParticipants);

    yield takeEvery(CASE_TYPES_FETCH_REQUESTED, fetchCaseTypes);
    yield takeEvery(CASE_ROLES_FETCH_REQUESTED, fetchCaseRoles);
    yield takeEvery(CASE_SIDES_FETCH_REQUESTED, fetchCaseSides);

    yield takeEvery(DEPARTMENTS_FETCH_REQUESTED, fetchDepartments);
    yield takeEvery(ADD_DEPARTMENT_REQUESTED, addDepartment);
    yield takeEvery(UPDATE_DEPARTMENT_REQUESTED, updateDepartment);
    yield takeEvery(DELETE_DEPARTMENT_REQUESTED, deleteDepartment);

    yield takeEvery(CALENDARS_FETCH_REQUESTED, fetchCalendars);
    yield takeEvery(ADD_CALENDAR_REQUESTED, addCalendar);
    yield takeEvery(UPDATE_CALENDAR_REQUESTED, updateCalendar);
    yield takeEvery(DELETE_CALENDAR_REQUESTED, deleteCalendar);
}

export default CaseSaga;
