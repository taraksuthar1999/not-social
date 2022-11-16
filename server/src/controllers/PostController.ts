import Post from "../models/Post";
import { customResponse } from "../responses/ResponseMessage";
import { Response,Request } from "express";
import { ObjectId } from "mongodb";

export default class PostController{
    public async create(req:Request,res:Response){
        try {
            let userId = req.user.Id
            let {title,body,tags} = req.body
            const obj = {
                title,
                body,
                tags,
                userId,
            }
            await new Post(obj).create()
            return res.reply(customResponse['POST_CREATE_SUCCESS'])
        } catch (error) {
            return res.reply(customResponse["POST_CREATE_ERROR"])
        }
    }

    public async edit(req:Request,res:Response){
        try {
            const {id} = req.params
            const post = new Post().setId(new ObjectId(id))
            await post.edit(req.body)
            return res.reply(customResponse["POST_EDIT_SUCCESS"])
        } catch (error) {
            return res.reply(customResponse["POST_EDIT_ERROR"])
        }
    }

    public async delete(req:Request,res:Response){
        try {
            const {id} = req.params
            await new Post().setId(new ObjectId(id)).setUserId(req.user.Id).delete()
            return res.reply(customResponse["POST_DELETE_SUCCESS"])
        } catch (error) {
            return res.reply(customResponse["POST_DELETE_ERROR"])
        }
    }

    public async getPost(req:Request,res:Response){
        try {
            const {id} = req.params
            const post =  await new Post().setId(new ObjectId(id)).getPost()
            return res.reply(customResponse["FETCH_POST_SUCCESS"],post)
        } catch (error) {
            return res.reply(customResponse["FETCH_POST_ERROR"])
        }
    }

    public async getPosts(req:Request,res:Response){
        try {
            const {userId} = req.body
            const post = new Post()
            if(userId) post.setUserId(userId)
           const posts = await post.getAll()
            return res.reply(customResponse['FETCH_POSTS_SUCCESS'],posts)
        } catch (error) {
            console.log(error)
            return res.reply(customResponse['FETCH_POSTS_ERROR'])         
        }
    }
}