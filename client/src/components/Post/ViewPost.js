import { Box } from "@mui/system";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Link from '@mui/joy/Link';
import { Button, Divider, Grid, TextField } from "@mui/material";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import CommentList from "../Comment/CommentList";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useEffect } from "react";
import { useState } from "react";
import { useFormik, FormikProvider, Form } from "formik";
import * as Yup from "yup";
import { connect, useSelector } from "react-redux";
import {actions} from "../../store/post/actions";
import { useParams } from "react-router-dom";
import { SocketContext } from "../../contexts/context";
import * as React from "react";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { ModalContext } from "../../contexts/context";
import LoadingModal from "../../utils/LoadingModal";

const validationSchema = Yup.object({
  message: Yup.string()
    .required("Message is required")
    .min(3, "Too short")
    .label("message"),
});

const dateFormatter = new Intl.DateTimeFormat(undefined,{
    dateStyle:'medium',
    timeStyle:'short'
})



function ViewPost(props){
    const {like,unlike,fetchLike,fetchComment,listenForLike,isLiked,listenForComment} = React.useContext(SocketContext);
    const {openLogin} = React.useContext(ModalContext)  
    const {id} = useParams()
    const user = useSelector(state=>state.auth.user) ?? null
    const [likes,setLikes] = useState(0)
    const [liked,setLiked] = useState(false)

    useEffect(()=>{
        props.getPost({id})
    },[])
    
    const likeHandler = async(callback)=>{
        callback(id,user?._id,(state)=>{
          setLiked(state)
        })
    }

    useEffect(()=>{
        listenForLike(id,(count)=>{
            setLikes(count)
         })
        if(user) isLiked(id,user._id,(state)=>{
            setLiked(state) 
        })
    },[user])


    useEffect(()=>{
        fetchLike(id,(count)=>{
          setLikes(count)
        })
      },[liked])

    return props.loading?<LoadingModal/>:
                        <Box sx={{maxWidth:'sm',margin:'25px auto',border:"1px solid rgba(0, 0, 0, 0.12)"}}>
                            <Card sx={{ boxShadow:0,borderRadius:0,padding:'15px'}}>
                                <Box mb={3}>
                                <Typography><Link color="text.primary" fontSize={'1.5em'} underline="none">{props.post?.title}</Link></Typography>
                                </Box>
                                <Box mb={3}>
                                    <Box display={'flex'}>
                                        <Typography><Link color="text.primary" fontSize={'0.8em'} underline="none">{props.post?.user[0].company}</Link></Typography>
                                        <Typography sx={{ '&::before':{ content:'" | @"',marginLeft:"5px",fontSize:'0.8em'}}}><Link color="text.primary" fontSize="0.8em" underline="none">{props.post?.user[0].userName}</Link></Typography>
                                    </Box>
                                    <Box display={'flex'}>
                                        <AccessTimeIcon fontSize="small" /><span>{props.post?.createdAt?dateFormatter.format(Date.parse(props.post?.createdAt)):null}</span>
                                    </Box>
                                </Box>
                                <Box mb={3}>
                                    <Typography justifyContent="left" variant="body2" color="text.secondary">
                                    <Link color='text.secondary'  underline="none">{props.post?.body}</Link>
                                    </Typography>
                                </Box>
                                <Divider/>
                                <Box mt={2}>
                                    {user?(liked?(
                                        <IconButton aria-label="like" onClick={()=>likeHandler(unlike)}>
                                            <ThumbUpAltIcon sx={{color:'red'}} fontSize="small" ></ThumbUpAltIcon><Typography color='text.primary' sx={{fontSize:"0.5em"}}>{likes}</Typography>
                                        </IconButton>
                                    ):(
                                        <IconButton aria-label="like" onClick={()=>likeHandler(like)}>
                                        <ThumbUpOffAltIcon sx={{color:'black'}} fontSize="small" /><Typography color='text.primary' sx={{fontSize:"0.5em"}}>{likes}</Typography>
                                        </IconButton>
                                    )):(
                                        <IconButton aria-label="like" onClick={()=>openLogin()}>
                                        <ThumbUpOffAltIcon sx={{color:'black'}} fontSize="small" /><Typography color='text.primary' sx={{fontSize:"0.5em"}}>{likes}</Typography>
                                        </IconButton>
                                    )}
                                </Box>
                            </Card>
                        </Box>
}

const commentAdd = actions.commentAdd
const getPost = actions.getPost
const ConnectedViewPost = connect((state) => state.post, { commentAdd ,getPost})(ViewPost);
export default ConnectedViewPost;