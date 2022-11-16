import React, { useEffect, useState } from "react";
import { call } from "redux-saga/effects";
import socketio from "socket.io-client";
import {io} from "socket.io-client";
export const ModalContext = React.createContext(false);
export const ModalProvider = ({children})=>{
    const [isShown,setIsShown] = React.useState(false)
    const [login,setLogin] = React.useState(false)
    const [register,setRegister] = React.useState(false)
    function openLogin(){
        setRegister(false)
        setLogin(true)
        setIsShown(true)
    }
    function openRegister(){
        setRegister(true)
        setLogin(false)
        setIsShown(true)
    }
    function close(){
        setRegister(false)
        setLogin(false)
        setIsShown(false)
    }
    return(
        <ModalContext.Provider value={{isShown,login,register,setIsShown,setLogin,setRegister,openLogin,close,openRegister}}>
            {children}
        </ModalContext.Provider>
    )
}
export const socket = socketio.connect(process.env.REACT_APP_BACKEND_URL, {
    withCredentials: true,
})
export const SocketContext = React.createContext(false);

export const SocketProvider = ({children})=>{
    useEffect(()=>{
        socket.on('connect',()=>{
        })
        socket.on("connect_error", (err) => {
            console.log(err)
            console.log(`connect_error due to ${err.message}`);
        })
    },[])
    const like = async(id,userId,callback)=>{
        await socket.emit('like',id,userId,callback)
    }
    const view = async(id)=>{
        await socket.emit('view',id)
    }
    const unlike = async(id,userId,callback)=>{
        await socket.emit('unlike',id,userId,callback)
    }
    const fetchLike = async(id,callback)=>{
        await socket.emit('likes',id,callback)
    }
    const fetchView = async(id,callback)=>{
        await socket.emit('views',id,callback)
    }
    const fetchComment = async(id,callback)=>{
        await socket.emit('comments',id,callback)
    }
    const listenForLike = async(id,callback)=>{
        await socket.on(`listen:like:${id}`,callback)
    }
    const listenForView = async(id,callback)=>{
        await socket.on(`listen:view:${id}`,callback)
    }
    const listenForComment = async(id,callback)=>{
        await socket.on(`listen:comment:${id}`,callback)
    }
    const isLiked = async(id,userId,callback)=>{
        if(!userId) return
        await socket.emit('isLiked',id,userId,callback)
    }
     return(
        <SocketContext.Provider value={{socket,like,unlike,fetchLike,listenForLike,view,listenForView,fetchView,isLiked,listenForComment,fetchComment}}>{children}</SocketContext.Provider>
    )
}



