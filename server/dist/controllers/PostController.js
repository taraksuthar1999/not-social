"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Post_1 = __importDefault(require("../models/Post"));
const ResponseMessage_1 = require("../responses/ResponseMessage");
const mongodb_1 = require("mongodb");
class PostController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userId = req.user.Id;
                let { title, body, tags } = req.body;
                const obj = {
                    title,
                    body,
                    tags,
                    userId,
                };
                yield new Post_1.default(obj).create();
                return res.reply(ResponseMessage_1.customResponse['POST_CREATE_SUCCESS']);
            }
            catch (error) {
                return res.reply(ResponseMessage_1.customResponse["POST_CREATE_ERROR"]);
            }
        });
    }
    edit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const post = new Post_1.default().setId(new mongodb_1.ObjectId(id));
                yield post.edit(req.body);
                return res.reply(ResponseMessage_1.customResponse["POST_EDIT_SUCCESS"]);
            }
            catch (error) {
                return res.reply(ResponseMessage_1.customResponse["POST_EDIT_ERROR"]);
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield new Post_1.default().setId(new mongodb_1.ObjectId(id)).setUserId(req.user.Id).delete();
                return res.reply(ResponseMessage_1.customResponse["POST_DELETE_SUCCESS"]);
            }
            catch (error) {
                return res.reply(ResponseMessage_1.customResponse["POST_DELETE_ERROR"]);
            }
        });
    }
    getPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const post = yield new Post_1.default().setId(new mongodb_1.ObjectId(id)).getPost();
                return res.reply(ResponseMessage_1.customResponse["FETCH_POST_SUCCESS"], post);
            }
            catch (error) {
                return res.reply(ResponseMessage_1.customResponse["FETCH_POST_ERROR"]);
            }
        });
    }
    getPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                const post = new Post_1.default();
                if (userId)
                    post.setUserId(userId);
                const posts = yield post.getAll();
                return res.reply(ResponseMessage_1.customResponse['FETCH_POSTS_SUCCESS'], posts);
            }
            catch (error) {
                console.log(error);
                return res.reply(ResponseMessage_1.customResponse['FETCH_POSTS_ERROR']);
            }
        });
    }
}
exports.default = PostController;
//# sourceMappingURL=PostController.js.map