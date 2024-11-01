
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
  CASE_PARTICIPANTS_FETCH_FAILED,
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
  DELETE_DEPARTMENT,
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
  UPDATE_DEPARTMENT,
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
import { allCasesFailed, allCasesRequested, allCasesSucceeded } from "./functions/allCases";
import { addCalendarFailed, addCalendarRequested, addCalendarSucceeded, calendarsFailed, calendarsRequested, calendarsSucceeded, deleteCalendarFailed, deleteCalendarRequested, deleteCalendarSucceded, updateCalendarFailed, updateCalendarRequested, updateCalendarSucceeded } from "./functions/calendars";
import { caseParticipantsFailed, caseParticipantsRequested, caseParticipantsSucceeded } from "./functions/caseParticipants";
import { caseRolesFailed, caseRolesRequested, caseRolesSucceeded } from "./functions/caseRoles";
import { caseSidesRequested, caseSidesSucceeded } from "./functions/caseSides";
import { caseTypesFailed, caseTypesRequested, caseTypesSucceeded } from "./functions/caseTypes";
import { addDepartmentFailed, addDepartmentRequested, addDepartmentSucceded, addDepartmentSucceeded, deleteDepartmentFailed, deleteDepartmentRequested, deleteDepartmentSucceded, departmentsFailed, departmentsRequested, departmentsSucceeded, updateDepartment, updateDepartmentFailed, updateDepartmentRequested, updateDepartmentSucceeded } from "./functions/departments";

import {removeCase, removeCurrentCase, setCurrentCase, userCasesFailed, userCasesRequested, userCasesSucceeded} from "./functions/userCases";
import { userSingleCaseFailed, userSingleCaseRequested, userSingleCaseSucceeded } from "./functions/userSingleCase";

const INIT_STATE = {
  allCases: [],
  cases: [],
  caseTypes: [],
  caseRoles: [],
  caseSides: [],
  departments: [],
  calendars: [],
  loading: false,
  isInit: false,
  error: false,
  message: null,

  currentCase: null,
};

const Case = (state = INIT_STATE, action) => {
  switch (action.type) {
    case ALL_CASES_FETCH_REQUESTED: return allCasesRequested(state, action);
    case ALL_CASES_FETCH_SUCCEEDED: return allCasesSucceeded(state, action); 
    case ALL_CASES_FETCH_FAILED: return allCasesFailed(state, action);  

    case USER_CASES_FETCH_REQUESTED: return userCasesRequested(state, action);
    case USER_CASES_FETCH_SUCCEEDED: return userCasesSucceeded(state, action); 
    case USER_CASES_FETCH_FAILED: return userCasesFailed(state, action);      
    
    case CASE_PARTICIPANTS_FETCH_REQUESTED: return caseParticipantsRequested(state,action);      
    case CASE_PARTICIPANTS_FETCH_SUCCEEDED: return caseParticipantsSucceeded(state,action);
    case CASE_PARTICIPANTS_FETCH_FAILED: return caseParticipantsFailed(state,action);
    
    case USER_SINGLE_CASE_FETCH_REQUESTED: return userSingleCaseRequested(state, action);
    case USER_SINGLE_CASE_FETCH_SUCCEEDED: return userSingleCaseSucceeded(state, action);
    case USER_SINGLE_CASE_FETCH_FAILED: return userSingleCaseFailed(state, action);

    case CASE_TYPES_FETCH_REQUESTED: return caseTypesRequested(state, action);
    case CASE_TYPES_FETCH_SUCCEEDED: return caseTypesSucceeded(state, action);
    case CASE_TYPES_FETCH_FAILED: return caseTypesFailed(state, action);

    case CASE_ROLES_FETCH_REQUESTED: return caseRolesRequested(state, action);
    case CASE_ROLES_FETCH_SUCCEEDED: return caseRolesSucceeded(state, action);
    case CASE_ROLES_FETCH_FAILED: return caseRolesFailed(state, action);

    case CASE_SIDES_FETCH_REQUESTED: return caseSidesRequested(state, action);
    case CASE_SIDES_FETCH_SUCCEEDED: return caseSidesSucceeded(state, action);
    case CASE_SIDES_FETCH_FAILED: return caseSidesSucceeded(state, action);

    case DEPARTMENTS_FETCH_REQUESTED: return departmentsRequested(state, action);
    case DEPARTMENTS_FETCH_SUCCEEDED: return departmentsSucceeded(state, action);
    case DEPARTMENTS_FETCH_FAILED: return departmentsFailed(state, action);

    case ADD_DEPARTMENT_REQUESTED: return addDepartmentRequested(state, action);
    case ADD_DEPARTMENT_SUCCEEDED: return addDepartmentSucceeded(state, action);
    case ADD_DEPARTMENT_FAILED: return addDepartmentFailed(state, action);

    case UPDATE_DEPARTMENT_REQUESTED: return updateDepartmentRequested(state, action);
    case UPDATE_DEPARTMENT_SUCCEEDED: return updateDepartmentSucceeded(state, action);
    case UPDATE_DEPARTMENT_FAILED: return updateDepartmentFailed(state, action);

    case DELETE_DEPARTMENT_REQUESTED: return deleteDepartmentRequested(state, action);
    case DELETE_DEPARTMENT_SUCCEEDED: return deleteDepartmentSucceded(state, action);
    case DELETE_DEPARTMENT_FAILED: return deleteDepartmentFailed(state, action);

    case CALENDARS_FETCH_REQUESTED: return calendarsRequested(state, action);
    case CALENDARS_FETCH_SUCCEEDED: return calendarsSucceeded(state, action);
    case CALENDARS_FETCH_FAILED: return calendarsFailed(state, action);

    case ADD_CALENDAR_REQUESTED: return addCalendarRequested(state, action);
    case ADD_CALENDAR_SUCCEEDED: return addCalendarSucceeded(state, action);
    case ADD_CALENDAR_FAILED: return addCalendarFailed(state, action);

    case UPDATE_CALENDAR_REQUESTED: return updateCalendarRequested(state, action);
    case UPDATE_CALENDAR_SUCCEEDED: return updateCalendarSucceeded(state, action);
    case UPDATE_CALENDAR_FAILED: return updateCalendarFailed(state, action);

    case DELETE_CALENDAR_REQUESTED: return deleteCalendarRequested(state, action);
    case DELETE_CALENDAR_SUCCEEDED: return deleteCalendarSucceded(state, action);
    case DELETE_CALENDAR_FAILED: return deleteCalendarFailed(state, action);

    case REMOVE_CASE: return removeCase(state, action);

    case SET_CURRENT_CASE: return setCurrentCase(state, action);
    case REMOVE_CURRENT_CASE: return removeCurrentCase(state, action);
      
    default:
      return state;
  }
};

export default Case;
