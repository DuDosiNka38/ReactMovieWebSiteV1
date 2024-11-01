const requested = (state, action) => {
  return {
    ...state,
    loading: true,
    error: false,
  };
};
const failed = (state, action) => {
  return {
    ...state,
    loading: false,
    error: true,
    message: action.payload,
  };
};
//SYNC SHARE
export const userUpcomingEventsRequested = requested;
export const userUpcomingEventsFailed = failed;
export const userUpcomingEventsSucceeded = (state, action) => {
  return {
    ...state,
    Upcoming_Events: action.payload,
    loading: false,
    isInit: true,
    error: false,
  };
};
