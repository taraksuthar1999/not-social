import { Router } from "express";
import { faker } from '@faker-js/faker';
import Collections from "../db/Collections"
import bcryptjs from "bcryptjs";    
import RedisProvider from "../db/Redis";

const router = Router();
export const company = ["simform","tatvasoft","yudiz","crestdata","motadata","gatway"]

router.get("/seed",async(req,res)=>{
  for(let i = 0;i<5;i++){
    let user = {
      email:faker.internet.email(),
      userName:faker.name.firstName(),
      password:bcryptjs.hashSync("Tarak12345",10),
      company:company[Math.floor(Math.random()*6)],
      createdAt: new Date()
    }
    const {insertedId} = await Collections.users.insertOne(user)
    for(let j =0;j<5;j++){
      let newPost = {
        tag:faker.helpers.arrayElements(['tech','finance','sports','property']),
        title:faker.lorem.sentence(8),
        body:faker.lorem.paragraphs(3, '<br/>\n'),
        createdAt:faker.date.recent(),  
        userId:insertedId
      }
      const post =await Collections.post.insertOne(newPost) 
      await RedisProvider.client.zadd('comments',0,post.insertedId)
      await RedisProvider.client.zadd('likes',0,post.insertedId)
      await RedisProvider.client.zadd('views',0,post.insertedId)
    }
  }
  res.status(200).send("seed success.")
});
router.get('/empty',async(req,res)=>{
  await Collections.users.deleteMany({})
  await Collections.post.deleteMany({})
  await Collections.comments.deleteMany({})
  res.status(200).send("db empty")
})
export default router;