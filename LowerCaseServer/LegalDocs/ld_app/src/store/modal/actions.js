import { ADD_MODAL, ADD_MODALS, HIDE_MODAL, MAXIMIZE_MODAL, MINIMIZE_MODAL, SHOW_MODAL, TOGGLE_MODAL } from "./actionTypes";

export const addModal = (type, component) => ({
	type: ADD_MODAL,
	payload:  { type, component }
});

export const addModals = (modals) => ({
	type: ADD_MODALS,
	payload:  { modals }
});

export const toggleModal = (type, props) => ({
	type: TOGGLE_MODAL,
	payload:  { type, props }
});

export const showModal = (type, props) => ({
	type: SHOW_MODAL,
	payload:  { type, props }
});

export const hideModal = (type, props) => ({
	type: HIDE_MODAL,
	payload:  { type, props }
});

export const minimizeModal = (type) => {
  return {
	type: MINIMIZE_MODAL,
	payload:  {type}
}};

export const maximizeModal = (type) => ({
	type: MAXIMIZE_MODAL,
	payload:  {type}
});