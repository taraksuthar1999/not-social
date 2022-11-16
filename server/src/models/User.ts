import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import { Helper } from "../Helper";
import { Common } from "./Common";
import Database from "../db/Database";
import Collections from "../db/Collections";

export default class User extends Common{
    private userName:string|null|undefined
    private name:string
    private avatar:string
    private token:string
    private status:string
    private email:string
    private password: string
    private company:string
    private posts!:Array<any>

    constructor(obj?:any){
        super()
        this._id = obj._id
        this.email = obj.email 
        this.userName = obj.userName 
        this.password = obj.password
        this.company = obj.company  
        this.createdAt = obj.createdAt
        this.updatedAt = obj.updatedAt
        this.token = obj.token
    }
    
    get Id(){
        return this._id
    }
    get UserName(){
        return this.userName
    }
    public async login(){
        try {
            this.token = jwt.sign({ sub:this.email},'secret',{expiresIn:'24h'})
            await Collections.users.updateOne({_id:this._id},{$set:{token:this.token}})
            return this
        } catch (error) {
            throw new Error('Login error.')
        }
    }
    public async logout(){
        try {
            this.token = ''
            await Collections.users.updateOne({_id:this._id},{$set:{token:this.token}})
            return this
        } catch (error) {
            throw new Error('Logout error.')
        }
    }
}