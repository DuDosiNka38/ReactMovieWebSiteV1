import { combineReducers  } from 'redux';

// Front
import Layout from './layout/reducer';
import User from './user/reducer'
import Files from './files/reducer'
import Sync from './sync/reducer'

// Authentication Module
import Account from './auth/register/reducer';
import Login from './auth/login/reducer';
// import Forget from './auth/forgetpwd/reducer';

const rootReducer = combineReducers({

    // public
    Layout,
    User,
    Files,
    Sync,


    // Authentication
    Account,
    Login,

});

export default rootReducer;