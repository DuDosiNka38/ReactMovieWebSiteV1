import {
  ADD_CALENDAR_FAILED,
  ADD_CALENDAR_REQUESTED,
  ADD_CALENDAR_SUCCEEDED,
  ADD_DEPARTMENT_FAILED,
  ADD_DEPARTMENT_REQUESTED,
  ADD_DEPARTMENT_SUCCEEDED,
  ALL_CASES_FETCH_FAILED,
  ALL_CASES_FETCH_REQUESTED,
  ALL_CASES_FETCH_SUCCEEDED,
  CALENDARS_FETCH_FAILED,
  CALENDARS_FETCH_REQUESTED,
  CALENDARS_FETCH_SUCCEEDED,
  CASE_PARTICIPANTS_FETCH_REQUESTED,
  CASE_PARTICIPANTS_FETCH_SUCCEEDED,
  CASE_ROLES_FETCH_FAILED,
  CASE_ROLES_FETCH_REQUESTED,
  CASE_ROLES_FETCH_SUCCEEDED,
  CASE_SIDES_FETCH_FAILED,
  CASE_SIDES_FETCH_REQUESTED,
  CASE_SIDES_FETCH_SUCCEEDED,
  CASE_TYPES_FETCH_FAILED,
  CASE_TYPES_FETCH_REQUESTED,
  CASE_TYPES_FETCH_SUCCEEDED,
  DELETE_CALENDAR_FAILED,
  DELETE_CALENDAR_REQUESTED,
  DELETE_CALENDAR_SUCCEEDED,
  DELETE_DEPARTMENT_FAILED,
  DELETE_DEPARTMENT_REQUESTED,
  DELETE_DEPARTMENT_SUCCEEDED,
  DEPARTMENTS_FETCH_FAILED,
  DEPARTMENTS_FETCH_REQUESTED,
  DEPARTMENTS_FETCH_SUCCEEDED,
  REMOVE_CASE,
  REMOVE_CURRENT_CASE,
  SET_CURRENT_CASE,
  UPDATE_CALENDAR_FAILED,
  UPDATE_CALENDAR_REQUESTED,
  UPDATE_CALENDAR_SUCCEEDED,
  UPDATE_DEPARTMENT_FAILED,
  UPDATE_DEPARTMENT_REQUESTED,
  UPDATE_DEPARTMENT_SUCCEEDED,
  USER_CASES_FETCH_FAILED,
  USER_CASES_FETCH_REQUESTED,
  USER_CASES_FETCH_SUCCEEDED,
  USER_SINGLE_CASE_FETCH_FAILED,
  USER_SINGLE_CASE_FETCH_REQUESTED,
  USER_SINGLE_CASE_FETCH_SUCCEEDED,
} from "./actionTypes";

//ALL CASES
export const allCasesFetchRequested = () => ({
  type: ALL_CASES_FETCH_REQUESTED,
  payload: null,
});
export const allCasesFetchSucceeded = (data) => ({
  type: ALL_CASES_FETCH_SUCCEEDED,
  payload: data,
});
export const allCasesFetchFailed = (eMessage) => ({
  type: ALL_CASES_FETCH_FAILED,
  payload: eMessage,
});

//CASES
export const userCasesFetchRequested = () => ({
  type: USER_CASES_FETCH_REQUESTED,
  payload: null,
});
export const userCasesFetchSucceeded = (data) => ({
  type: USER_CASES_FETCH_SUCCEEDED,
  payload: data,
});
export const userCasesFetchFailed = (eMessage) => ({
  type: USER_CASES_FETCH_FAILED,
  payload: eMessage,
});

//CASE PARTICIPANTS
export const caseParticipantsFetchRequested = (Case_NAME) => ({
  type: CASE_PARTICIPANTS_FETCH_REQUESTED,
  payload: Case_NAME,
});
export const caseParticipantsFetchSucceeded = (data) => ({
  type: CASE_PARTICIPANTS_FETCH_SUCCEEDED,
  payload: data,
});
export const caseParticipantsFetchFailed = (eMessage) => ({
  type: CASE_TYPES_FETCH_FAILED,
  payload: eMessage,
});

//SINGLE CASE
export const userSingleCaseFetchRequested = (Case_Short_NAME) => ({
  type: USER_SINGLE_CASE_FETCH_REQUESTED,
  payload: Case_Short_NAME,
});
export const userSingleCaseFetchSucceeded = (data) => ({
  type: USER_SINGLE_CASE_FETCH_SUCCEEDED,
  payload: data,
});
export const userSingleCaseFetchFailed = (eMessage) => ({
  type: USER_SINGLE_CASE_FETCH_FAILED,
  payload: eMessage,
});

//CASE TYPES
export const caseTypesFetchRequested = () => ({
  type: CASE_TYPES_FETCH_REQUESTED,
  payload: null,
});
export const caseTypesFetchSucceeded = (data) => ({
  type: CASE_TYPES_FETCH_SUCCEEDED,
  payload: data,
});
export const caseTypesFetchFailed = (eMessage) => ({
  type: CASE_TYPES_FETCH_FAILED,
  payload: eMessage,
});

//CASE ROLES
export const caseRolesFetchRequested = () => ({
  type: CASE_ROLES_FETCH_REQUESTED,
  payload: null,
});
export const caseRolesFetchSucceeded = (data) => ({
  type: CASE_ROLES_FETCH_SUCCEEDED,
  payload: data,
});
export const caseRolesFetchFailed = (eMessage) => ({
  type: CASE_ROLES_FETCH_FAILED,
  payload: eMessage,
});

//CASE SIDES
export const caseSidesFetchRequested = () => ({
  type: CASE_SIDES_FETCH_REQUESTED,
  payload: null,
});
export const caseSidesFetchSucceeded = (data) => ({
  type: CASE_SIDES_FETCH_SUCCEEDED,
  payload: data,
});
export const caseSidesFetchFailed = (eMessage) => ({
  type: CASE_SIDES_FETCH_FAILED,
  payload: eMessage,
});

//DEPARTMENTS
export const departmentsFetchRequested = () => ({
  type: DEPARTMENTS_FETCH_REQUESTED,
  payload: null,
});
export const departmentsFetchSucceeded = (data) => ({
  type: DEPARTMENTS_FETCH_SUCCEEDED,
  payload: data,
});
export const departmentsFetchFailed = (eMessage) => ({
  type: DEPARTMENTS_FETCH_FAILED,
  payload: eMessage,
});

export const addDepartmentRequested = (data) => ({
  type: ADD_DEPARTMENT_REQUESTED,
  payload: data,
});
export const addDepartmentSucceded = (data) => ({
  type: ADD_DEPARTMENT_SUCCEEDED,
  payload: data,
});
export const addDepartmentFailed = (eMessage) => ({
  type: ADD_DEPARTMENT_FAILED,
  payload: eMessage,
});

export const updateDepartmentRequested = (data) => ({
  type: UPDATE_DEPARTMENT_REQUESTED,
  payload: data,
});
export const updateDepartmentSucceeded = (data) => ({
  type: UPDATE_DEPARTMENT_SUCCEEDED,
  payload: data,
});
export const updateDepartmentFailed = (data) => ({
  type: UPDATE_DEPARTMENT_FAILED,
  payload: data,
});

export const deleteDepartmentRequested = (data) => ({
  type: DELETE_DEPARTMENT_REQUESTED,
  payload: data,
});
export const deleteDepartmentSucceded = (data) => ({
  type: DELETE_DEPARTMENT_SUCCEEDED,
  payload: data,
});
export const deleteDepartmentFailed = (data) => ({
  type: DELETE_DEPARTMENT_FAILED,
  payload: data,
});

//CALENDARS
export const calendarsFetchRequested = () => ({
  type: CALENDARS_FETCH_REQUESTED,
  payload: null,
});
export const calendarsFetchSucceeded = (data) => ({
  type: CALENDARS_FETCH_SUCCEEDED,
  payload: data,
});
export const calendarsFetchFailed = (eMessage) => ({
  type: CALENDARS_FETCH_FAILED,
  payload: eMessage,
});

export const addCalendarRequested = (data) => ({
  type: ADD_CALENDAR_REQUESTED,
  payload: data,
});
export const addCalendarSucceded = (data) => ({
  type: ADD_CALENDAR_SUCCEEDED,
  payload: data,
});
export const addCalendarFailed = (eMessage) => ({
  type: ADD_CALENDAR_FAILED,
  payload: eMessage,
});

export const updateCalendarRequested = (data) => ({
  type: UPDATE_CALENDAR_REQUESTED,
  payload: data,
});
export const updateCalendarSucceeded = (data) => ({
  type: UPDATE_CALENDAR_SUCCEEDED,
  payload: data,
});
export const updateCalendarFailed = (data) => ({
  type: UPDATE_CALENDAR_FAILED,
  payload: data,
});

export const deleteCalendarRequested = (data) => ({
  type: DELETE_CALENDAR_REQUESTED,
  payload: data,
});
export const deleteCalendarSucceded = (data) => ({
  type: DELETE_CALENDAR_SUCCEEDED,
  payload: data,
});
export const deleteCalendarFailed = (data) => ({
  type: DELETE_CALENDAR_FAILED,
  payload: data,
});

//LOCAL ACTIONS
export const removeCase = (Case_Short_NAME) => ({
  type: REMOVE_CASE,
  payload: Case_Short_NAME,
});

export const setCurrentCaseAction = (data) => ({
  type: SET_CURRENT_CASE,
  payload: data
})

export const removeCurrentCaseAction = () => ({
  type: REMOVE_CURRENT_CASE,
  payload: null
})