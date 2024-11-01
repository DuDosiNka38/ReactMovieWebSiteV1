import { combineReducers  } from 'redux';

// Front
import Layout from './layout/reducer';
import Main from './main/reducer';
import Modal from './modal/reducer';
import Ref from './ref/reducer';
import Case from './case/reducer';
import User from './user/reducer';
import Preloader from './preloader/reducer';
import Personnel from './personnel/reducer';
import Documents from './documents/reducer';
import Sync from './sync/reducer';
import Event from './event/reducer';
import ProgressModal from './progress-modal/reducer';



const rootReducer = combineReducers({

    // public
    Layout,
    Main,
    Modal,
    Ref,
    Case,
    User,
    Preloader,
    Personnel,
    Documents,
    Sync,
    ProgressModal,
    Event
    // Authentication
 

});

export default rootReducer;