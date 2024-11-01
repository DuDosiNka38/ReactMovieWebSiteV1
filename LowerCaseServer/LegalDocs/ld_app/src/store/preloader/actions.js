import { HIDE_PRELOADER, SHOW_PRELOADER } from "./actionTypes";

export const showPreloader = (caller) => ({
	type: SHOW_PRELOADER,
	payload:  caller
});
export const hidePreloader = (caller) => ({
	type: HIDE_PRELOADER,
	payload:  caller
});