import ConnectedViewPost from "./ViewPost"
import { Grid } from "@mui/material"
import ConnectedViewPostForm from "./ViewPostForm"
export default function ViewPostCard(){
    return (
        <Grid container>
            <Grid item md={8}>
                <ConnectedViewPost/>
                <ConnectedViewPostForm/>
            </Grid>
        </Grid>
    )
}