import { Common } from "./Common";
import { Collection, Db, ObjectId } from "mongodb"
import { Helper } from "../Helper";
import Collections from "../db/Collections";
import RedisProvider from "../db/Redis";

export default class Post extends Common{
    private title:string|null|undefined
    private slug:string
    private body:string
    private userId:ObjectId|null|undefined
    private tags:[string]

    constructor();
    constructor(obj:any);
    constructor(obj?:any){
        super()
        this._id = obj?._id
        this.body = obj?.title 
        this.title = obj?.body
        this.userId = obj?.userId
        this.tags = obj?.tags
    }

    setId(id:ObjectId){
        this._id = id
        return this
    }
    setUserId(id:ObjectId){
        this.userId = id
        return this
    }

    async create(){
        let slug = Helper.slugify(this.title)
        let insetObj ={
            body:this.body,
            title:this.title,
            userId:this.userId,
            tags:this.tags ,
            slug
        }
        try {
            const {insertedId} = await Collections.post.insertOne(insetObj)
            await RedisProvider.client.zadd("likes",0,insertedId)
            await RedisProvider.client.zadd("comments",0,insertedId)
            await RedisProvider.client.zadd("views",0,insertedId)
        } catch (error) {
            throw new Error('Post create error.')
        }
    }
    

    async edit(obj:any){
        let updatedAt = new Date()
        obj = {
            ...obj,
            updatedAt
        }
        try {
            await Collections.post.updateOne({_id:this._id},obj)
        } catch (error) {
            throw new Error()
        }
    }

    async delete(){
        try {
            await Collections.post.deleteOne({_id:this._id,userId:this.userId})
        } catch (error) {
            console.log(error)
            throw new Error()
        }
    }

    async getPost(){
        try {
            return await Collections.post.aggregate([
                {
                    $match:{
                        _id:this._id
                    }
                },{
                    $lookup:{
                        from:"comments",
                        let:{id:"$_id"},
                        pipeline:[
                            {
                                $match:{$expr:{$eq:["$parentId","$$id"]}}
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
                            },{
                                $sort:{
                                    createdAt:-1
                                }
                            }
                        ],
                        as:'comments'
                    }
                }
                ,{
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
        } catch (error) {
            throw new Error()
        }
    }
    
    async getAll(){
        try {
            const postlist = []
            const posts =  await Collections.post.aggregate([
                {
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
                },{
                    $limit:30
                },{
                    $sort:{
                        createdAt:-1
                    }
                }
            ]).toArray()
            for await(let post of posts){
                let newPost = {
                    ...post,
                    likes:await RedisProvider.client.zscore('likes',post._id),
                    views:await RedisProvider.client.zscore('views',post._id),
                    comments:await RedisProvider.client.zscore('comments',post._id),
                    isLiked:this.userId?Boolean(await RedisProvider.client.zscore(`liked:${post._id}`,String(this.userId))):false
                }
                postlist.push(newPost)
            };
            return postlist
        } catch (error) {
            console.log(error)
            throw new Error()
        }
    }



}
