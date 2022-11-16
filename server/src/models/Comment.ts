import { ObjectId } from "mongodb";
import Collections from "../db/Collections";
import RedisProvider from "../db/Redis";
import Socket from "../socket/Socket";
import { Common } from "./Common";

export default class Comment extends Common{
    private parentId:ObjectId
    private message:string
    private userId:ObjectId

    constructor()
    constructor(obj:any)
    constructor(obj?:any){
        super()
        this.message = obj?.message
        this.parentId = obj?.parentId
        this.userId = obj?.userId
    }
    setId(id:ObjectId){
        this._id = id
        return this
    }
    setParentId(id:ObjectId){
        this.parentId = id
        return this
    }
    async getCommentsByParentId(){
        try {
            return await Collections.comments.aggregate([
                {
                    $match:{
                        parentId:this.parentId
                    }
                },{
                    $lookup:{
                        from:"users",
                        let:{id:"$userId"},
                        pipeline:[{
                            $match:{$expr:{$eq:["$_id","$$id"]}}
                        },{
                            $project:{userName:1,company:1,_id:0}
                        }],
                        as:"user"
                    }
                }
            ]).toArray()
            // .find({parentId:this.parentId}).toArray()
        } catch (error) {
            throw new Error()
        }
    }
    async add(){
        try {
            const {insertedId} = await Collections.comments.insertOne({parentId:this.parentId,message:this.message,userId:this.userId,createdAt:new Date()})
            const count = await RedisProvider.client.zincrby('comments',1,String(this.parentId))
            Socket.io.emit(`listen:comment:${this.parentId}`,Number(count))
            return insertedId
        } catch (error) {
            throw new Error(error)
        }
    }

    async delete(){
        try {
            await Collections.comments.deleteOne({_id:this._id})
            await RedisProvider.client.zincrby('comments',-1,String(this.parentId))
        } catch (error) {
            throw new Error(error)
        }
    }
}