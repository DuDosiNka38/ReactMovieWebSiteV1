import { PERSONNEL_FETCH_FAILED, PERSONNEL_FETCH_REQUESTED, PERSONNEL_FETCH_SUCCEEDED, ROLES_FETCH_FAILED, ROLES_FETCH_REQUESTED, ROLES_FETCH_SUCCEEDED } from "./actionTypes";
import { personnelFailed, personnelRequested, personnelSucceeded, rolesFailed, rolesRequested, rolesSucceeded } from "./functions/personnel";

const INIT_STATE = {
  personnel: [],
  Roles: [],
  loading: false,
  isInit: false,
  error: false,
  message: null,
};

const Personnel = (state = INIT_STATE, action) => {
  switch (action.type) {
    case PERSONNEL_FETCH_REQUESTED: return personnelRequested(state, action);
    case PERSONNEL_FETCH_SUCCEEDED: return personnelSucceeded(state, action); 
    case PERSONNEL_FETCH_FAILED: return personnelFailed(state, action); 

    case ROLES_FETCH_REQUESTED: return rolesRequested(state, action);
    case ROLES_FETCH_SUCCEEDED: return rolesSucceeded(state, action); 
    case ROLES_FETCH_FAILED: return rolesFailed(state, action);     
      
    default:
      return state;
  }
};

export default Personnel;
