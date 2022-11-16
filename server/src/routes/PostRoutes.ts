import * as Joi from '@hapi/joi'
import {validator,isAuthenticated} from "../middlewares";
import { Router } from "express";
import PostController from '../controllers/PostController';
const router = Router();
const userRegisterBodySchema = Joi.object().keys({
    userName:Joi.string().required(),
    email:Joi.string().required(),
    password:Joi.string().required()
})
const userLoginBodySchema = Joi.object().keys({
    password:Joi.string().required(),
    email:Joi.string().required()
})
router.post("/create",isAuthenticated,new PostController().create);
router.post("/edit/:id",isAuthenticated,new PostController().edit);
router.get("/delete/:id",isAuthenticated,new PostController().delete);
router.get("/:id",new PostController().getPost);
router.post("/",new PostController().getPosts);
export default router;