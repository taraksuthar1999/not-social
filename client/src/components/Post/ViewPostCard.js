import ConnectedViewPost from "./ViewPost"
import { Grid } from "@mui/material"
import ConnectedViewPostForm from "./ViewPostForm"
import LoadingModal from "../../utils/LoadingModal"
import {actions} from "../../store/post/actions"
import { connect, useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import { useEffect } from "react"
function ViewPostCard(props){
    const loading =  useSelector(state=>state.post.loading)
    const {id} = useParams()    

    useEffect(()=>{
        if(props.post?._id != id)props.getPost({id})
    },[])
    return (
        loading?<LoadingModal/>:
        <Grid container>
            <Grid item md={8}>
                <ConnectedViewPost/>
                <ConnectedViewPostForm/>
            </Grid>
        </Grid>
    )
}

const getPost = actions.getPost
const ConnectedViewPostCard = connect((state) => state.post,{getPost})(ViewPostCard);
export default ConnectedViewPostCard ;