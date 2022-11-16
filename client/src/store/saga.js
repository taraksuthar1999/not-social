import { postSaga } from "./post/saga";
import { authSaga } from "./auth/saga";
import { all, fork } from 'redux-saga/effects'
export default function* rootSaga(){
    yield all([
        fork(authSaga),
        fork(postSaga),
    ]);
}