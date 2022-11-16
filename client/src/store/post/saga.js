import { takeEvery, call, put, take } from "redux-saga/effects";
import { actions } from "./actions";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function* getPosts({ payload }) {
    try {
      const {userId} = payload
      const response = yield call(async () => {
        return await axios
          .post(`${process.env.REACT_APP_BASE_URL}/post`,{userId})
          .then((res) => {
            return res;
          });
      });
      yield put(actions.getPostsSuccess(response.data.data));
    } catch (error){
      console.log(error)    
    }
}
function* getPost({ payload }) {
    try {
      const {id} = payload
      const response = yield call(async () => {
        return await axios
          .get(`${process.env.REACT_APP_BASE_URL}/post/${id}`)
          .then((res) => {
            return res;
          });
      });
      yield put(actions.getPostSuccess(response.data.data[0]));
    } catch (error){
      console.log(error)    
    }
}
function* commentAdd({ payload }) {
    try {
      const {message,parentId,callback} = payload
      const response = yield call(async () => {
        return await axios
          .post(`${process.env.REACT_APP_BASE_URL}/comment/add`,{message,parentId})
          .then((res) => {
            return res;
          });
      });
      if(response) callback()
      yield put(actions.commentAddSuccess({}));

    } catch (error){
      console.log(error)    
    }
}
function* getCommentsByParentId({ payload }) {
  try {
    const {id} = payload
    const response = yield call(async () => {
      return await axios
        .get(`${process.env.REACT_APP_BASE_URL}/comment/post/${id}`)
        .then((res) => {
          return res;
        });
    });
    yield put(actions.getCommentsByParentIdSuccess(response.data.data));

  } catch (error){
    console.log(error)    
  }
}

export function* postSaga() {
    yield takeEvery(actions.getPosts, getPosts);
    yield takeEvery(actions.commentAdd, commentAdd);
    yield takeEvery(actions.getPost, getPost);
    yield takeEvery(actions.getCommentsByParentId, getCommentsByParentId);
}