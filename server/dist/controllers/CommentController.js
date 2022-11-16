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
const mongodb_1 = require("mongodb");
const Comment_1 = __importDefault(require("../models/Comment"));
const ResponseMessage_1 = require("../responses/ResponseMessage");
class CommentController {
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { parentId, message } = req.body;
                const userId = req.user.Id;
                const commentObj = {
                    parentId: new mongodb_1.ObjectId(parentId),
                    message,
                    userId
                };
                const insertedId = yield new Comment_1.default(commentObj).add();
                if (!insertedId)
                    throw new Error();
                return res.reply(ResponseMessage_1.customResponse['COMMENT_ADD_SUCCESS']);
            }
            catch (error) {
                return res.reply(ResponseMessage_1.customResponse["COMMENT_ADD_ERROR"]);
            }
        });
    }
    getComments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const comments = yield new Comment_1.default().setParentId(new mongodb_1.ObjectId(id)).getCommentsByParentId();
                return res.reply(ResponseMessage_1.customResponse['COMMENTS_FETCH_SUCCESS'], comments);
            }
            catch (error) {
                return res.reply(ResponseMessage_1.customResponse["COMMENTS_FETCH_ERROR"]);
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { commentId } = req.params;
                yield new Comment_1.default().setId(new mongodb_1.ObjectId(commentId)).delete();
                return res.reply(ResponseMessage_1.customResponse["COMMENT_DELETE_SUCCESS"]);
            }
            catch (error) {
                return res.reply(ResponseMessage_1.customResponse["COMMENT_DELETE_ERROR"]);
            }
        });
    }
}
exports.default = CommentController;
//# sourceMappingURL=CommentController.js.map