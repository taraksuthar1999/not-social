import express, { NextFunction } from "express";
import http from 'http'
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/AuthRoutes";
import postRoutes from "./routes/PostRoutes"
import commentRoutes from "./routes/CommentRoutes"
import seedRoutes from "./routes/SeedRoutes"
import { Response } from "express";
import Database from './db/Database'
import { customResponse } from "./responses/ResponseMessage";
import User from "./models/User";
import Redis from "./db/Redis";
import Socket from './socket/Socket'


type status = {
  code:number
  message:string
}

declare global {
  namespace Express {
    interface Request {
      user?:User
    }
    interface Response{
      reply(status:status,data?:any,header?:any):any
    }
  }
}

const app = express();
const server = http.createServer(app) 


dotenv.config();
Database.init()
Redis.init()
Socket.init(server)

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use((_req, res: Response, next) => {
  res.reply = ({ code, message }, data = {}, header = undefined) => {
    res.status(code).header(header).json({ message, data });
  };
  next();
});
app.use((req,res,next)=>{
  console.log(`${req.method} url::${req.url}`)
  next()
})

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/post",postRoutes);
app.use("/api/v1/comment",commentRoutes);
app.use("/api/v1",seedRoutes);

app.use((err:Error,_req:any,res:any,next:NextFunction)=>{
  err.message?res.reply({code:405,message:err.message}):
  res.reply(customResponse['SERVER_ERROR'])
})

const PORT = process.env.PORT;

server.listen(PORT, () => console.log(`Server up and running on ${PORT}`));
