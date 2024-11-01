import { REMIND_LATER_NOT_UPLOADED, SET_AUTH_HASH, SET_HOST_INFO, SET_SYSTEM_INFO } from './actionTypes'
const INIT_STATE = {
  system: {},
  hostInfo: {},
	auth_hash: undefined,
  remindLaterNotUploaded: false,
};

const Main = (state = INIT_STATE, action) => {
	switch (action.type) {
		case SET_SYSTEM_INFO:
			return {
				...state,
				system: action.payload
			};
		case SET_AUTH_HASH:
			return {
				...state,
				auth_hash: action.payload
			};
		case SET_HOST_INFO:
			return {
				...state,
				hostInfo: action.payload
			};

    case REMIND_LATER_NOT_UPLOADED: 
      return {
        ...state,
        remindLaterNotUploaded: true,
      }
		
		default:
			return state;
	}
};

export default Main;
