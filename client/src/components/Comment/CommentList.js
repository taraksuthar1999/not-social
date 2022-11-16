import { Grid } from "@mui/material"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import Comment from "./Comment"

export default function CommentList({comments}){
  let [rootComments,setRootComments] = useState(comments)
  return (
    <Grid container  display={'flex'}>
        {rootComments?.map(comment=>{    
            return (<Grid item xs={12} padding="5px" key={comment._id}>
                <Comment data={comment}/>
            </Grid>)
        })}
    </Grid>
  )
}