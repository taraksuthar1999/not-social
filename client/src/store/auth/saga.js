import { takeEvery, call, put, take } from "redux-saga/effects";
import { actions } from "./actions";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function* login({ payload }) {
  try {
    const {email,password} = payload
    const response = yield call(async () => {
      return await axios
        .post(`${process.env.REACT_APP_BASE_URL}/auth/login`,{email,password})
        .then((res) => {
          return res;
        });
    });
    yield put(actions.loginSuccess(response));
    payload.onLoginSuccess()
  } catch (error) {
    yield put(actions.loginFailed(error?.response?.data?.message));
  }
}
function* register({ payload }) {
  try {
    const {userName,email,password} = payload;
    const response = yield call(async () => {
      return await axios
        .post(`${process.env.REACT_APP_BASE_URL}/auth/register`, {userName,email,password})
        .then((res) => {
          console.log(res);
          return res;
        });
    });
    yield put(actions.registerSuccess(response));
    payload.onRegisterSuccess()
  } catch (error) {
    yield put(actions.registerFailed(error?.response.data.message));
  }
}
function* logout({ payload }) {
  try {
    const response = yield call(async () => {
      return await axios
        .get(`${process.env.REACT_APP_BASE_URL}/auth/logout`)
        .then((res) => {
          return res;
        });
    });
    yield put(actions.logoutSuccess({}));
    payload?.onLogoutSuccess()
  } catch (error) {
    console.log(error)
  }
}
function* getProfile({ payload }) {
    try {
      const response = yield call(async () => {
        return await axios
          .get(`${process.env.REACT_APP_BASE_URL}/auth/profile`)
          .then((res) => {
            return res;
          });
      });
      yield put(actions.loginSuccess(response))
    } catch (error) {
      yield put(actions.logoutSuccess({}))
    }
}
export function* authSaga() {
  yield takeEvery(actions.login, login);
  yield takeEvery(actions.getProfile, getProfile);
  yield takeEvery(actions.register, register);
  yield takeEvery(actions.logout, logout);
}
