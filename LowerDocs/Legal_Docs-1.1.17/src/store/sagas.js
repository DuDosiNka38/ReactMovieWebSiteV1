import { all } from 'redux-saga/effects'

//public
import loginSaga from './auth/login/saga';
import LayoutSaga from './layout/saga';
import UserSaga from './user/saga'
import FileSaga from './files/saga'
import SyncSaga from './sync/saga'

export default function* rootSaga() {
    yield all([
        
        //public
        loginSaga(),
        LayoutSaga(),
        UserSaga(),
        FileSaga(),
        SyncSaga()
    ])
}