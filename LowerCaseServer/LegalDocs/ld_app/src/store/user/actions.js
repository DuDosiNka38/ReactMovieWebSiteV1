import { USER_FETCH_FAILED, USER_FETCH_REQUESTED, USER_FETCH_SUCCEEDED } from "./actionTypes";

export const userFetchRequested = () => ({
	type: USER_FETCH_REQUESTED,
	payload:  null
});
export const userFetchSucceeded = (data) => ({
	type: USER_FETCH_SUCCEEDED,
	payload:  data
});
export const userFetchFailed = (eMessage) => ({
	type: USER_FETCH_FAILED,
	payload:  eMessage
});