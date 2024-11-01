import { USER_UPCOMING_EVENTS_FETCH_FAILED, USER_UPCOMING_EVENTS_FETCH_REQUESTED, USER_UPCOMING_EVENTS_FETCH_SUCCEEDED } from "./actionTypes";
import { userUpcomingEventsFailed, userUpcomingEventsRequested, userUpcomingEventsSucceeded } from "./functions/events";

const INIT_STATE = {
  Upcoming_Events: [],

  loading: false,
  isInit: false,
  error: false,
  message: null,
};

const Sync = (state = INIT_STATE, action) => {
  switch (action.type) {
    case USER_UPCOMING_EVENTS_FETCH_REQUESTED: return userUpcomingEventsRequested(state, action);
    case USER_UPCOMING_EVENTS_FETCH_SUCCEEDED: return userUpcomingEventsSucceeded(state, action); 
    case USER_UPCOMING_EVENTS_FETCH_FAILED: return userUpcomingEventsFailed(state, action); 
      
    default:
      return state;
  }
};

export default Sync;
