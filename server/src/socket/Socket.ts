import { Server } from "socket.io"
import RedisProvider from "../db/Redis";

export default class Socket{
    public static io

    public static init(server){
        this.io = new Server(server,{cors: {
            origin:process.env.ORIGIN,
            credentials: true
        }})
        this.io.on("connection",(socket)=>{
            console.log(socket.id)
            socket.on('like',async(postId:any,userId:any,callback)=>{
                console.log(userId)
                const count = await RedisProvider.client.zincrby('likes',1,postId)
                await RedisProvider.client.zadd(`liked:${postId}`,Date.now(),userId)
                socket.broadcast.emit(`listen:like:${postId}`,Number(count))
                callback(true)
            })
            socket.on('view',async(postId:any)=>{
                const count = await RedisProvider.client.zincrby('views',1,postId)
                socket.broadcast.emit(`listen:view:${postId}`,Number(count))
            })
            socket.on('unlike',async(postId:any,userId,callback)=>{
                const count = await RedisProvider.client.zincrby('likes',-1,postId)
                await RedisProvider.client.zrem(`liked:${postId}`,Date.now(),userId)
                socket.broadcast.emit(`listen:like:${postId}`,Number(count))
                callback(false)
            })
            socket.on('likes',async(postId:any,callback?:any)=>{
                const count = await RedisProvider.client.zscore('likes',postId)
                callback(count)
            })
            socket.on('comments',async(postId:any,callback?:any)=>{
                const count = await RedisProvider.client.zscore('comments',postId)
                callback(count)
            })
            socket.on('views',async(postId:any,callback?:any)=>{
                const count = await RedisProvider.client.zscore('views',postId)
                callback(count)
            })
            socket.on('isLiked',async(postId:any,userId:any,callback:any)=>{
                const score  = await RedisProvider.client.zscore(`liked:${postId}`,userId)
                callback(Boolean(score))
            })
        })
    }
}