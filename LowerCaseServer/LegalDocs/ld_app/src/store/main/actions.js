import { REMIND_LATER_NOT_UPLOADED, SET_AUTH_HASH, SET_HOST_INFO, SET_SYSTEM_INFO } from "./actionTypes";

export const setSystemInfo = (data) => ({
	type: SET_SYSTEM_INFO,
	payload:  data
});

export const setAuthHash = (hash) => ({
	type: SET_AUTH_HASH,
	payload:  hash
});

export const setHostInfo = (data) => ({
	type: SET_HOST_INFO,
	payload:  data
});

export const remindLaterNotUploaded = () => ({
	type: REMIND_LATER_NOT_UPLOADED,
	payload: null
});