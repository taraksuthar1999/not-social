import React from "react";
import { useFormik, FormikProvider, Form } from "formik";
import CommentList from "../Comment/CommentList";
import { Button, Divider, Grid, TextField } from "@mui/material";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import * as Yup from "yup";
import {actions} from "../../store/post/actions";
import { Box } from "@mui/system";
import Typography from "@mui/material/Typography";
import { ModalContext } from "../../contexts/context";
import LoadingModal from "../../utils/LoadingModal";
import { SocketContext } from "../../contexts/context";
import { connect, useSelector } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";

const validationSchema = Yup.object({
    message: Yup.string()
      .required("Message is required")
      .min(3, "Too short")
      .label("message"),
  });
  
  const dateFormatter = new Intl.DateTimeFormat(undefined,{
      dateStyle:'medium',
      timeStyle:'short'
  })
  

function ViewPostForm(props){
    const {like,unlike,fetchLike,fetchComment,listenForLike,isLiked,listenForComment} = React.useContext(SocketContext);
    const [commentCount,setCommentCount] = useState(false)
    const user = useSelector(state=>state.auth.user) ?? null
    const {openLogin} = React.useContext(ModalContext)
    const {id} = useParams()    
    const [comments,setComments] = useState(0)
     const initialState = {
        message: "",
    };
    const [initFormData,setInitFormData] = useState(initialState);

    useEffect(()=>{
        fetchComment(id,(count)=>{
            setComments(count)
        })
        props.getCommentsByParentId({id})
    },[commentCount,comments])

    useEffect(()=>{
        listenForComment(id,(count)=>{
            setComments(count)
        })
    },[user])

    const onSubmit = async (formData) => {
        props.commentAdd({message:formData.message,parentId:props.post._id,callback:()=>setCommentCount(prev=>!prev)})
    };
    
    const formik = useFormik({
        initialValues: initFormData,
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: (values,{resetForm}) =>{           
            onSubmit(values)
            resetForm(initialState)
        } 
    });
    const { handleChange, handleSubmit, values, errors, touched, handleBlur } = formik;

    return (
        <>
             <Box sx={{ maxWidth:'sm',margin:'25px auto',border:"1px solid rgba(0, 0, 0, 0.12)",padding:"15px"}}>
                <FormikProvider value={formik}>
                    <Form onSubmit={handleSubmit}>
                        <Box display={"flex"}>
                        <TextField fullWidth 
                            name="message"
                            placeholder="Comment"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.message}
                            error={errors.message && touched.message}
                            helperText={errors.message && touched.message ? errors.email : null}
                        />
                    {user?<Button type="submit">Post</Button>:<Button onClick={()=>openLogin()}>Post</Button>}
                        </Box>
                    </Form>
                </FormikProvider>
            </Box>
            <Box sx={{ maxWidth:'sm',margin:'25px auto',border:"1px solid rgba(0, 0, 0, 0.12)"}}>
                <Box sx={{padding:"15px",fontSize:"0.5em"}}>
                    <Typography>{comments} Comments</Typography>
                </Box>
                <Divider/>
                <Box>
                    <CommentList comments={props.comments}/>
                </Box>
            </Box>
        </>
    )
}

const commentAdd = actions.commentAdd
const getCommentsByParentId = actions.getCommentsByParentId
const ConnectedViewPostForm = connect((state) => state.post, { commentAdd,getCommentsByParentId })(ViewPostForm);
export default ConnectedViewPostForm;