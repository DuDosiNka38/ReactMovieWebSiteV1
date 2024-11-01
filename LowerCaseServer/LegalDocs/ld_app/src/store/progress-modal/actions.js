import { ADD_PROGRESS_MODAL, ADD_PROGRESS_MODALS, HIDE_PROGRESS_MODAL, SHOW_PROGRESS_MODAL, TOGGLE_PROGRESS_MODAL, UPDATE_PROGRESS_MODAL } from "./actionTypes";

export const addModal = (type, component) => ({
	type: ADD_PROGRESS_MODAL,
	payload:  { type, component }
});

export const addModals = (modals) => ({
	type: ADD_PROGRESS_MODALS,
	payload:  { modals }
});

export const toggleModal = (type, props) => ({
	type: TOGGLE_PROGRESS_MODAL,
	payload:  { type, props }
});

export const showModal = (type, props, cb) => ({
	type: SHOW_PROGRESS_MODAL,
	payload:  { type, props, cb }
});

export const hideModal = ({type, props, _id}) => ({
	type: HIDE_PROGRESS_MODAL,
	payload:  { type, props, _id }
});

export const updateModal = ({type, props, _id}) => ({
	type: UPDATE_PROGRESS_MODAL,
	payload:  {type, props, _id}
});