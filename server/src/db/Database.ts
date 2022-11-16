import dotenv from "dotenv";
import { MongoClient, Db } from "mongodb";
import Collections from './Collections'

dotenv.config();
class Database {

  public static db:Db
  public static count:number = 0

  static async init(){
      MongoClient.connect(process.env.MONGO_URL,(err,database)=>{
        // this.count = this.count +1 //single connection
        // console.log(this.count)
        if(err) console.log('Unable to connect to database')
        this.db = database?.db(process.env.DB)
        Collections.init(this.db)
      })
  }
}
export default Database;
