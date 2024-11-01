import { createStore, applyMiddleware, compose } from "redux";
import { reduxBatch } from '@manaflair/redux-batch';
// import logger from "redux-logger";

import createSagaMiddleware from "redux-saga";

import rootReducer from "./reducers";
import rootSaga from "./sagas";

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(reduxBatch, applyMiddleware(sagaMiddleware), reduxBatch)

);
sagaMiddleware.run(rootSaga);

export default store;
