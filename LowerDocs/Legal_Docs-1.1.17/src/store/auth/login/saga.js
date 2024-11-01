import { takeEvery, fork, put, all, call } from 'redux-saga/effects';

// Login Redux States
import { CHECK_LOGIN, LOGOUT_USER, CHECK_USER } from './actionTypes';
import { apiError, getUserData, loginUserSuccessful  } from './actions';

// AUTH related methods
// import {  postCheckUser } from '../../../helpers/fackBackend_Helper';

function* loginUser({ payload: { user, history } }) {
    

    //LOCALLLLLLLLLLL
    const response = { id: 1, login: 'Admin', password: '123456', email: 'admin@themesdesign.in' };       
    localStorage.setItem("authUser", JSON.stringify(response));    
    yield put(loginUserSuccessful(response));
    history.push('/general');
        
    // SERVERRRRRRRRRR
    // const response = yield call(postLogin, 'axios-handler.php', {handler: "login", function: "check_user", data: {user_email: user.user_email, user_password: user.user_password}});
    // if(response.result){
    //     localStorage.setItem("authUser", JSON.stringify(response.userData));
    //     localStorage.setItem("userAuthHash", response.userData.userAuthHash);
    //     yield put(loginUserSuccessful(response.userData));
    //     history.push('/general');
    //     console.log(response.userData);
    // } else {
    //     console.log("permission denide!!!!!");
    // }
        
     
}


function* checkUser({ payload: {user}}) {
    

    try {
        const response = yield call( 'axios-handler.php', {handler: "login", function: "check_user", data: {user_email: user.user_email, user_password: user.user_password}});
        // yield put(getUserData(response));
        yield put({response: response})

      } catch (error) {
        yield put(getUserData(error));
      }
    
    
    // const response = yield call(postCheckUser, 'axios-handler.php', {handler: "login", function: "check_user", data: {user_email: user.user_email, user_password: user.user_password}});
    // yield put(getUserData(response));
    
}





function* logoutUser({ payload: { history } }) {
    try {
        localStorage.removeItem("authUser");

  
        history.push('/login');
    } catch (error) {
        yield put(apiError(error));
    }
}

export function* watchUserLogin() {
    yield takeEvery(CHECK_LOGIN, loginUser)
   
}

export function* watchCheckUser() {
    yield takeEvery(CHECK_USER, checkUser)
}

export function* watchUserLogout() {
    yield takeEvery(LOGOUT_USER, logoutUser)
}

function* loginSaga() {
    yield all([
        fork(watchUserLogin),
        fork(watchUserLogout),
        fork(watchCheckUser),
    ]);
}

export default loginSaga;