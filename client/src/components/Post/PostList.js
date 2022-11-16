import { useState } from "react";
import { getPost } from "../../services/post";

export function PostList({data}){

    const [posts,setPosts] = useState([])

    useState(async()=>{
        let post = await getPost()
        setPosts([...post])
    },[posts])

    return posts.length?(
        <ul>{
        posts.map((post)=>{
            return (
                <li key={post.id}>Post {post.id}</li>
            )
        })
        }</ul>
    ):(
        <p>Loading...</p>
    )
}