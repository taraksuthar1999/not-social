import { Box } from "@mui/system"
import { TextField } from "@mui/material"
import {Button} from "@mui/material"

export default function CommentForm(){
    return(
        <Box display="flex">
            <TextField fullWidth id="fullWidth" />
            <Button>Post</Button>
        </Box>
    )
}