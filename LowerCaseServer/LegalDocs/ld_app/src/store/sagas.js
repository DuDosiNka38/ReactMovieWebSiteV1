import { all } from 'redux-saga/effects'

//public

import LayoutSaga from './layout/saga';
import CaseSaga from './case/saga';
import UserSaga from './user/saga';
import PersonnelSaga from './personnel/saga';
import DocumentsSaga from './documents/saga';
import SyncSaga from './sync/saga';
import EventsSaga from './event/saga';

export default function* rootSaga() {
    yield all([
        
        //public
     
        LayoutSaga(),
        CaseSaga(),
        UserSaga(),
        PersonnelSaga(),
        DocumentsSaga(),
        SyncSaga(),
        EventsSaga()
    ])
}