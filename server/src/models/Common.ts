import { Collection, Db, ObjectId } from "mongodb"
import Database from "../db/Database"
import { Helper } from "../Helper"

export abstract class Common{
    protected _id:ObjectId | null | undefined 
    protected createdAt : Date | null | undefined
    protected updatedAt : Date | null | undefined 
}

