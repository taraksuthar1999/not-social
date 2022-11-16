import * as Joi from '@hapi/joi'
import {validator,isAuthenticated} from "../middlewares";
import {createValidator} from 'express-joi-validation'
import { Router } from "express";
import AuthController from "../controllers/AuthController";
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
router.post("/register",validator(userRegisterBodySchema), new AuthController().register);
router.post("/login",validator(userLoginBodySchema),new AuthController().login);
router.get("/profile",isAuthenticated,new AuthController().profile);
router.get("/logout",isAuthenticated, new AuthController().logout);
export default router;
