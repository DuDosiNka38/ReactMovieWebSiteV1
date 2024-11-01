import {
  Request_Files
} from "./actionTypes";

const INIT_STATE = {
  syncResult: {}
};

const Files = (state = INIT_STATE, action) => {
  switch (action.type) {
    case Request_Files:
      return {
        ...state,
        syncResult: action.payload,
      };
    
    default:
      return state;
  }
};

export default Files;
