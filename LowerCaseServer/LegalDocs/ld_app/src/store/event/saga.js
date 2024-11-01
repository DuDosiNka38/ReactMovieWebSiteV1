import { all, call, fork, takeEvery, put } from "redux-saga/effects";
import * as EventActions from "./actions";
import * as PreloaderActions from "./../preloader/actions";
import EventsApi from "../../api/EventsApi";
import { USER_UPCOMING_EVENTS_FETCH_REQUESTED } from "./actionTypes";

function* fetchUserUpcomingEvents(action) {
  try {
    yield put(PreloaderActions.showPreloader("fetchUserUpcomingEvents"));
    const userUpcomingEvents = yield call(EventsApi.fetchUserUpcomingEvents, action.payload);
    yield put(EventActions.userUpcomingEventsFetchSucceeded(userUpcomingEvents));
  } catch (e) {
    yield put(EventActions.userUpcomingEventsFetchFailed(e.message));
  } finally {
    yield put(PreloaderActions.hidePreloader("fetchUserUpcomingEvents"));
  }
}


function* EventsSaga() {
  yield takeEvery(USER_UPCOMING_EVENTS_FETCH_REQUESTED, fetchUserUpcomingEvents);
}

export default EventsSaga;
