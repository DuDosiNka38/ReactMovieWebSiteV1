import { CHECK_LOGIN, LOGIN_USER_SUCCESSFUL, API_ERROR,LOGOUT_USER, LOGOUT_USER_SUCCESS, CHECK_USER, GET_USER_DATA} from './actionTypes';

export const checkLogin = (user, history) => {
    return {
        type: CHECK_LOGIN,
        payload: { user, history }
    }
}

export const checkUser = (user) => {
    return {
        type: CHECK_USER,
        payload: {user},
    
        // response: {response},
    }
}
export const getUserData = (user) => {
    return {
        type: GET_USER_DATA,
        payload: user,
        // response: {response},
    }
}

export const loginUserSuccessful = (user) => {
    return {
        type: LOGIN_USER_SUCCESSFUL,
        payload: user
    }
}

export const apiError = (error) => {
    return {
        type: API_ERROR,
        payload: error
    }
}

export const logoutUser = (history) => {
    return {
        type: LOGOUT_USER,
        payload: { history }
    }
}

export const logoutUserSuccess = () => {
    return {
        type: LOGOUT_USER_SUCCESS,
        payload: {}
    }
}

