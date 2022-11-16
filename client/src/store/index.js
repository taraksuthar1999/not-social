import { createStore } from "redux";
import { applyMiddleware, compose, combineReducers } from "redux";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { logger } from "redux-logger";
import createSagaMiddleware from "redux-saga";
import authReducer from "./auth/actions.js";
import rootReducer from "./reducer"
import rootSaga from "./saga.js";
import { authSaga } from "./auth/saga";
let sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer:rootReducer,
  middleware: [
    sagaMiddleware,
  ],
});
sagaMiddleware.run(rootSaga);
export default store;
