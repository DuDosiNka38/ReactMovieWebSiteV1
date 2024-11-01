import { USER_UPCOMING_EVENTS_FETCH_FAILED, USER_UPCOMING_EVENTS_FETCH_REQUESTED, USER_UPCOMING_EVENTS_FETCH_SUCCEEDED } from "./actionTypes";

//userUpcomingEvents ALL
export const userUpcomingEventsFetchRequested = (Person_id) => ({
  type: USER_UPCOMING_EVENTS_FETCH_REQUESTED,
  payload: Person_id,
});
export const userUpcomingEventsFetchSucceeded = (data) => ({
  type: USER_UPCOMING_EVENTS_FETCH_SUCCEEDED,
  payload: data,
});
export const userUpcomingEventsFetchFailed = (eMessage) => ({
  type: USER_UPCOMING_EVENTS_FETCH_FAILED,
  payload: eMessage,
});
