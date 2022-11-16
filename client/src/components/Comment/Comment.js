import { Card, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Link from "@mui/joy/Link";
import IconButton from "@mui/material/IconButton";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import { SocketContext } from "../../contexts/context";
import * as React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { ModalContext } from "../../contexts/context";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { useSelector } from "react-redux"

const dateFormatter = new Intl.DateTimeFormat(undefined,{
    dateStyle:'medium',
    timeStyle:'short'
})

export default function Comment({data}){
    const {like,unlike,fetchLike,listenForLike,isLiked} = React.useContext(SocketContext);
    const {openLogin} = React.useContext(ModalContext)
    const user = useSelector(state=>state.auth.user) ?? null
    const [likes,setLikes] = useState(0)
    const [liked,setLiked] = useState(false)

    const likeHandler = async(callback)=>{
        callback(data._id,user?._id,(state)=>{
          setLiked(state)
        })
    }

    useEffect(()=>{
        listenForLike(data._id,(count)=>{
            setLikes(count)
         })
        if(user) isLiked(data._id,user._id,(state)=>{
            setLiked(state) 
        })
    },[user])

    useEffect(()=>{
        fetchLike(data._id,(count)=>{
          setLikes(count)
        })
    },[liked])

    return(
       <Card sx={{ boxShadow:0,borderRadius:0,padding:'5px'}}>
            <Box display={'flex'} mb={0}>
                <Typography><Link color="text.primary" fontSize={'0.6em'} underline="none">{data.user[0].company}</Link></Typography>
                <Typography sx={{ '&::before':{ content:'" | @"',marginLeft:"5px",fontSize:'0.6em'}}}><Link color="text.primary" fontSize="0.6em" underline="none">{data.user[0].userName}</Link></Typography>
            </Box>
            <Box>
                <Typography justifyContent="left" variant="body2" color="text.secondary">
                <Link color='text.secondary'  underline="none">{data.message}</Link>
                </Typography>
            </Box>
            <Box display={"flex"}>
                <Box>
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
                <IconButton>
                    <Typography color='text.primary' sx={{fontSize:"0.5em"}}>{dateFormatter.format(Date.parse(data?.createdAt))}</Typography>
                </IconButton>
            </Box>
       </Card>
    )
}