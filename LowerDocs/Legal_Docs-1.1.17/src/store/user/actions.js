import {
  requestedPersoneData,
  requestedCaseSuces,
  requestedDepartments,
  requestedCaseTypes,
  requestedGlobalData,
  requestedParticipantRolesData,
  requestedUserRoles,
  GetDepartment,
  requestedError,
  GetCaseType,
  GetPerson,
  getKeywords,
  requestedKeywords,
  GetCase,
  LocalEvents,
  GetGlobalData,
  IS_USER_LOGGED,
  IS_USER_CHECK,
  IS_MOUNT_DATA,
  requestedAllUsersData,
  getAllUsersData,
  getStaff,
  requestedStaff,
  getUserRoles,
  getPrviliges,
  getRolePrviliges,
  requestedPrviliges,
  requestedRolePrviliges,
  GetParticipantRoles,
  getCalendars,
  requestedCalendars,
  getRelationType,
  requestedRelationType,
  requestedAllEvents,
  getAllEvents,
  requestedCaseStatus,
  getCaseStatus,
  requestedAllAlerts,
  getAllAlerts,
  requestedAllTodos,
  getAllTodos,
  getActivityTypes,
  requestedActivityTypes,
  getSettings,
  requestedSettings,
  requestedGlobalKeywords,
  getGlobalKeywords,
  requestedSyncPath,
  
} from "./actionTypes";

/////local

export const setLocalEvents = (data) => {
  return { type: LocalEvents, payload: data };
};




export const requestCaseStatus = (data) => {
  return { type: requestedCaseStatus, payload: data.data.Core.Case_Statuses };
};
export const getCaseStat = (data) => {
  return { type: getCaseStatus, payload: data };
};

export const requestAllAlerts = (data) => {
  return { type: requestedAllAlerts, payload: data.data.Core.Alerts };
};


export const getAllAlert= (data) => {
  return { type: getAllAlerts, payload: data };
};


export const requestAllTodo = (data) => {
  return { type: requestedAllTodos, payload: data.data.Core.To_dos };
};
export const getAllTodo= (data) => {
  return { type: getAllTodos, payload: data };
};

//////
//!todo
//!todo

export const requestGlobalKeywords = (data) => {
  return { type: requestedGlobalKeywords, payload: data.data.Core.Doc_Keywords };
};
export const getGKeywords = (data) => {
  return { type: getGlobalKeywords, payload: data };
};

//!todo
export const requestStaff = (data) => {
  return { type: requestedStaff, payload: data.data.Core.Users };
};
export const getStf = (data) => {
  return { type: getStaff, payload: data };
};
export const requestSettings = (data) => {
  return { type: requestedSettings, payload: data.data.Core.Settings };
};
export const getSetting = (data) => {
  return { type: getSettings, payload: data };
};

export const requestKeywords= (data) => {
  return { type: requestedKeywords, payload: data.data.Core.Doc_Keywords };
};
export const getKeyword = (data) => {
  return { type: getKeywords, payload: data };
};



export const requestActivityType = (data) => {
  return { type: requestedActivityTypes, payload: data.data.Core.Activity_Types };
};
export const getActivityType = (data) => {
  return { type: getActivityTypes, payload: data };
};




export const requestPreviliges = (data) => {
  return { type: requestedPrviliges, payload: data.data.Core.Privileges };
};
export const getPrevilige = (data) => {
  return { type: getPrviliges, payload: data };
};


export const requestRolePreviliges = (data) => {
  return { type: requestedRolePrviliges, payload: data.data.Core.Role_Privileges };
};
export const getRolePrvilige = (data) => {
  return { type: getRolePrviliges, payload: data };
};
//!todo
//!todo
//!todo
//////


//local

export const requestSyncPath = (data) => {
  return { type: requestedSyncPath, payload: data };
};

//

export const requestAllEvents = (data) => {
  return { type: requestedAllEvents, payload: data.data.Core.Events };
};
export const getAllEvent = (data) => {
  return { type: getAllEvents, payload: data };
};


export const chekUserLogged = (status) => {
  return { type: IS_USER_LOGGED, payload: status };
};
export const chekUseCheck = (status) => {
  return { type: IS_USER_CHECK, payload: status };
};
export const chekMountData = (status) => {
  return { type: IS_MOUNT_DATA, payload: status };
};

export const requestRelationType = (data) => {
  return {
    type: requestedRelationType,
    payload: data.data.Core.Relation_Types,
  };
};
export const getRelationTypes = () => {
  return { type: getRelationType };
};

export const requestCalendars = (data) => {
  return { type: requestedCalendars, payload: data.data.Core.Calendars };
};
export const getCalendar = () => {
  return { type: getCalendars };
};

export const requestUserRoles = (data) => {
  return { type: requestedUserRoles, payload: data.data.Core.User_Roles };
};
export const getUserRole = () => {
  return { type: getUserRoles };
};

export const requestGlobalData = (data) => {
  return { type: requestedGlobalData, payload: data.data.Core };
};
export const getGlobalData = () => {
  return { type: GetGlobalData };
};

export const requestParticipantRolesSuccess = (data) => {
  return {
    type: requestedParticipantRolesData,
    payload: data.data.Core.Participant_Roles,
  };
};
export const getParticipantRoles = () => {
  return { type: GetParticipantRoles };
};

export const requestPersonDataSuccess = (data) => {
  return { type: requestedPersoneData, payload: data.data.Person };
};
export const getPersonData = () => {
  return { type: GetPerson };
};

export const requestCaseSuccess = (data) => ({
  type: requestedCaseSuces,
  payload: data.data.Core.Cases,
});
export const getCase = () => {
  return { type: GetCase };
};

export const requestDepartmentsSuccess = (data) => {
  return { type: requestedDepartments, payload: data.data.Core.Departments };
};
export const getDepartament = () => {
  return { type: GetDepartment };
};
export const requestCaseTypesSucsess = (data) => {
  return { type: requestedCaseTypes, payload: data.data.Core.Case_Types };
};
export const getCasesType = () => {
  return { type: GetCaseType };
};

export const requestAllUsersData = (data) => {
  return { type: requestedAllUsersData, payload: data.data.Core.Personnel };
};
export const getAllUserData = () => {
  return { type: getAllUsersData };
};

export const requestError = () => {
  return { type: requestedError };
};
