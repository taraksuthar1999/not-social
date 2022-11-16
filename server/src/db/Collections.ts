import { Db } from "mongodb";

export default class Collections{
    public static users:any
    public static post:any
    public static comments:any

    public static init(db:Db|undefined){
        this.users = db?.collection('users')
        this.post = db?.collection('posts') 
        this.comments = db?.collection('comments')
    }
}
