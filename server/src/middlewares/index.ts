import { NextFunction, Request } from "express";
import jwt from "jsonwebtoken";
import Collections from "../db/Collections";

import {
    customResponse,
  } from "../responses/ResponseMessage";
import User from "../models/User";



export const validator = (schema) =>{
    return (req:Request,res:any,next:NextFunction)=>{
        try {
            const {error,value} = schema.validate(req.body)
            if(error===undefined) return next()
            throw new Error(error.details.map(err=>err.message))
        } catch (error) {
            next(error)  
        }
    }
}

export const isAuthenticated = async(req:Request,res:any,next:NextFunction)=>{
    try {
        const token = req.header('Authorization')?.replace('Bearer ','')
        if(!token) return res.reply(customResponse['TOKEN_REQUIRED'])
        let payload = jwt.verify(token,process.env.SECRET)
        if(!payload) return res.reply(customResponse["INVALID_TOKEN"])
        const user = await Collections.users.findOne({ email:payload.sub,token:token})
        if(!user) return res.reply(customResponse["USER_NOT_FOUND"]) 
        req.user = new User(user)
        next()
    } catch (error) {
        next(error)
    }
}