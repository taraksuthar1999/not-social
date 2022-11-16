import { useState } from "react";
import * as React from "react";
import Link from '@mui/joy/Link';
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import Card from "@mui/material/Card";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import VisibilityIcon from "@mui/icons-material/Visibility";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { Box } from "@mui/system";
import { useEffect } from "react";
import { ModalContext, SocketContext } from "../../contexts/context";
import {Chip} from "@mui/material";
import { useSelector } from "react-redux";

const dateFormatter = new Intl.DateTimeFormat(undefined,{
  dateStyle:'medium',
  timeStyle:'short'
})

export default function Post({data}) {
  const {like,view,unlike,fetchLike,listenForLike,listenForView,fetchView,isLiked,listenForComment} = React.useContext(SocketContext);
  const {openLogin} = React.useContext(ModalContext)
  const user = useSelector(state=>state.auth.user) ?? null
  const [liked,setLiked] = useState(data.isLiked)
  const [likes,setLikes] = useState(data.likes)
  const [views,setViews] = useState(data.views)
  const [comments,setComments] = useState(data.comments)
  const navigate =  useNavigate()

  const likeHandler = async(callback)=>{
    callback(data._id,user?._id,(state)=>{
      setLiked(state)
    })
  }

  const read = ()=>{
    view(data._id)
    navigate(`/post/${data._id}`)
  }

  useEffect(()=>{
    fetchView(data._id,(count)=>{
      setViews(count)
    })
  },[views])

  useEffect(()=>{
      listenForLike(data._id,(count)=>{
        setLikes(count)
      })
      listenForView(data._id,(count)=>{
        setViews(count)
      })
      listenForComment(data._id,(count)=>{
        setComments(count)
      })
      isLiked(data._id,user?._id,(state)=>{
        setLiked(state) 
      })
  },[user])

  useEffect(()=>{
    fetchLike(data._id,(count)=>{
      setLikes(count)
    })
  },[liked])

  return (
    <Card sx={{ maxWidth:'sm',boxShadow:0,borderRadius:0,padding:'15px'}}>
      <Box mb={1}>
          <Link component={RouterLink}  to={'/'}  underline="none">
              {data.tag.length && data.tag.map((chip)=><Chip key={chip} label={chip} sx={{marginRight:1}} size="small" variant="outlined" />)} 
          </Link>
      </Box>
      <Box mb={3}>
      <Link  underline="none" onClick={()=>read()}><Typography fontWeight={'bold'} fontSize={'1.2em'} color="text.primary">{data.title.length>50?data.title?.slice(0,50)+'...':data.title}</Typography></Link>
      </Box>
      <Box mb={3}>
          <Link color='text.secondary' onClick={()=>read()}  underline="none">
            <Typography justifyContent="left" variant="body2" color="text.secondary">
                {data.body?.slice(0,150)+'...'}
            </Typography>
          </Link>
      </Box>
      <Box >
        <Box display={'flex'}>
            <Typography><Link color="text.primary" fontSize={'0.8em'} underline="none">{data.user[0].company}</Link></Typography>
            <Typography sx={{ '&::before':{ content:'" | @"',marginLeft:"5px",fontSize:'0.8em'}}}><Link color="text.primary" fontSize="0.8em" underline="none">{data.user[0].userName}</Link></Typography>
        </Box>
        <Box>
          <IconButton aria-label="read" onClick={()=>read()}>
            <VisibilityIcon sx={{color:'black'}} fontSize="small" /><Typography color='text.primary' sx={{fontSize:"0.5em"}}>{views}</Typography>
          </IconButton>
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
          <IconButton aria-label="comment">
            <ChatBubbleOutlineIcon sx={{color:'black'}} fontSize="small" /><Typography color='text.primary' sx={{fontSize:"0.5em"}}>{comments}</Typography>
          </IconButton>
          <IconButton>
            <Typography sx={{fontSize:"0.5em"}}>{dateFormatter.format(Date.parse(data.createdAt))}</Typography>
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
}