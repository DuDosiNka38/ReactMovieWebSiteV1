import { SET_REFFERER_DATA } from "./actionTypes";

export const setReffererData = (dataFor, data) => ({
	type: SET_REFFERER_DATA,
	payload:  { dataFor, data }
});