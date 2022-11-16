import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  error: {
    message: "",
    type: "",
  },
  data:null,
  loading: false,
  post:null,
  comments:null,
  posts:[]
};
const postReducer = createSlice({
  name: "post",
  initialState,
  reducers: {
    getPosts:(state,{payload}) => {
      state.loading = true
      state.data = payload          
    },
    getPostsSuccess:(state,{payload})=>{
        state.loading = false
        state.posts = payload
    },
    getPost:(state,{payload})=>{
        state.loading = true
        state.data = payload 
    },
    getPostSuccess:(state,{payload})=>{
        state.loading = false
        state.post = payload
    },
    commentAdd:(state,{payload})=>{
        state.loading = true
        state.data = payload
    },
    commentAddSuccess:(state,{})=>{
        state.loading = false
    },
    getCommentsByParentId:(state,{payload})=>{
      state.loading = true
      state.data = payload
    },
    getCommentsByParentIdSuccess:(state,{payload})=>{
      console.log(payload)
        // state.loading = false
        // state.comments = payload
    }
  },
});

export const { name, actions } = postReducer;
export default postReducer.reducer;
