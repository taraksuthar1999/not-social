import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axios from "axios";


const setAuthToken =token=>{
  if(token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
  else delete axios.defaults.headers.common["Authorization"]
}

const initialState = {
  error: {
    message: "",
    type: "",
  },
  loading: false,
  user: null,
  data: null,
  token: null,
};
const TOKEN = "token";
const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, { payload }) => {
      state.loading = true;
      state.data = payload;
    },
    loginSuccess: (state, { payload }) => {
      state.loading = false;
      state.token = payload.data.data.token;
      state.data = payload.data.data
      state.user = payload.data.data
      state.error.message = ''
      Cookies.set(TOKEN, payload.data.data.token, { path: "/" });
      setAuthToken(payload.data.data.token)
    },
    loginFailed: (state, { payload }) => {
      state.loading = false;
      state.error.message = payload;
      state.token = ""
    },
    register: (state, { payload }) => {
      state.loading = true;
      state.data = payload;
    },
    registerSuccess: (state, { payload }) => {
      state.loading = false;
      state.error.message = ''
    },
    registerFailed: (state, { payload }) => {
      state.loading = false;
      state.error.message = payload;
    },
    resetError: (state) => {
      state.error.message = "";
      state.loading = false
    },
    getProfile: (state, { payload }) => {
      state.loading = true;
    },
    logout:(state,{payload})=>{
        state.loading = true;
        state.data = payload;
    },
    logoutSuccess: (state, { payload }) => {
      state.loading = false;
      state.token = null;
      state.data = null;
      state.error.message = ''
      Cookies.remove('token');
    },
  },
});

export const { name, actions } = authReducer;
export const selectCurrentToken = (state) => {
  console.log("state", state);
  return state.auth.token;
};
export default authReducer.reducer;
