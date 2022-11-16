import { combineReducers } from "redux"
import authReducer from './auth/actions'
import postReducer from './post/actions'
export default combineReducers({
    auth: authReducer,
    post: postReducer
})