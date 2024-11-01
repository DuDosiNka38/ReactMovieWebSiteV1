import { USER_FETCH_FAILED, USER_FETCH_REQUESTED, USER_FETCH_SUCCEEDED } from "./actionTypes";

const INIT_STATE = {
    data: {},
    loading: false,
    error: false,
    message: null,
};

const User = (state = INIT_STATE, action) => {
	switch (action.type) {
		case USER_FETCH_REQUESTED:
			return {
				...state,
				data: {},
                loading: true,
                error:false
			};
        case USER_FETCH_SUCCEEDED:
            return {
                ...state,
                data: action.payload,
                loading: false,
                error:false
            };
        case USER_FETCH_FAILED:
            return {
                ...state,
                data: {},
                loading: false,
                error:true,
                message: action.payload
            };
		
		default:
			return state;
	}
};

export default User;