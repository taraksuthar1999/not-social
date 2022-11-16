import React, { useEffect, useState } from "react";
import {Grid} from "@mui/material";
import Box from "@mui/material/Box";
import Post from "./Post/Post";
import { connect, useDispatch, useSelector } from "react-redux";
import {actions} from "../store/post/actions";
import Loading from "../utils/Loading";
import LoadingModal from "../utils/LoadingModal";

function Home(props){
   useEffect(()=>{
      props.getPosts({userId:props.auth.user?._id})
   },[props.auth.user])
    return (
      <Box>
        <Grid container sx={{borderLeft:"1px solid rgba(0, 0, 0, 0.12)",borderTop:"1px solid rgba(0, 0, 0, 0.12)"}}>
          {props.post.loading?<LoadingModal/> : props.post.posts && props.post.posts.map((post)=><Grid item key={post._id}  sm={6} md={6} sx={{borderBottom:"1px solid rgba(0, 0, 0, 0.12)",borderRight:"1px solid rgba(0, 0, 0, 0.12)"}}>
              <Post data={post} />
            </Grid>)
          } 
        </Grid>
      </Box>
    );
  
}
const getPosts = actions.getPosts;
const ConnectedHome = connect((state) => state, { getPosts })(Home );
export default ConnectedHome;
