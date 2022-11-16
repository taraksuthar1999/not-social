import * as Joi from '@hapi/joi'
import {validator,isAuthenticated} from "../middlewares";
import { Router } from "express";
import CommentController from '../controllers/CommentController';
const router = Router();

const commentAddSchema = Joi.object().keys({
    parentId:Joi.string().required(),
    message:Joi.string().required()
})
router.post("/add",isAuthenticated,validator(commentAddSchema),new CommentController().add);
router.get("/post/:id",new CommentController().getComments);
// router.get("/delete/:id",isAuthenticated,new CommentController().delete);

export default router