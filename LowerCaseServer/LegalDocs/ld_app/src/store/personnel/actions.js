import { PERSONNEL_FETCH_FAILED, PERSONNEL_FETCH_REQUESTED, PERSONNEL_FETCH_SUCCEEDED, ROLES_FETCH_FAILED, ROLES_FETCH_REQUESTED, ROLES_FETCH_SUCCEEDED } from "./actionTypes";

//PERSONNEL ALL
export const personnelFetchRequested = () => ({
	type: PERSONNEL_FETCH_REQUESTED,
	payload:  null
});
export const personnelFetchSucceeded = (data) => ({
	type: PERSONNEL_FETCH_SUCCEEDED,
	payload:  data
});
export const personnelFetchFailed = (eMessage) => ({
	type: PERSONNEL_FETCH_FAILED,
	payload:  eMessage
});

//ROLES
export const rolesFetchRequested = () => ({
	type: ROLES_FETCH_REQUESTED,
	payload:  null
});
export const rolesFetchSucceeded = (data) => ({
	type: ROLES_FETCH_SUCCEEDED,
	payload:  data
});
export const rolesFetchFailed = (eMessage) => ({
	type: ROLES_FETCH_FAILED,
	payload:  eMessage
});
