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
const Collections_1 = __importDefault(require("../db/Collections"));
const Redis_1 = __importDefault(require("../db/Redis"));
const Socket_1 = __importDefault(require("../socket/Socket"));
const Common_1 = require("./Common");
class Comment extends Common_1.Common {
    constructor(obj) {
        super();
        this.message = obj === null || obj === void 0 ? void 0 : obj.message;
        this.parentId = obj === null || obj === void 0 ? void 0 : obj.parentId;
        this.userId = obj === null || obj === void 0 ? void 0 : obj.userId;
    }
    setId(id) {
        this._id = id;
        return this;
    }
    setParentId(id) {
        this.parentId = id;
        return this;
    }
    getCommentsByParentId() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Collections_1.default.comments.aggregate([
                    {
                        $match: {
                            parentId: this.parentId
                        }
                    }, {
                        $lookup: {
                            from: "users",
                            let: { id: "$userId" },
                            pipeline: [{
                                    $match: { $expr: { $eq: ["$_id", "$$id"] } }
                                }, {
                                    $project: { userName: 1, company: 1, _id: 0 }
                                }],
                            as: "user"
                        }
                    },
                    {
                        $sort: {
                            createdAt: -1
                        }
                    }
                ]).toArray();
            }
            catch (error) {
                throw new Error();
            }
        });
    }
    add() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { insertedId } = yield Collections_1.default.comments.insertOne({ parentId: this.parentId, message: this.message, userId: this.userId, createdAt: new Date() });
                const count = yield Redis_1.default.client.zincrby('comments', 1, String(this.parentId));
                Socket_1.default.io.emit(`listen:comment:${this.parentId}`, Number(count));
                return insertedId;
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Collections_1.default.comments.deleteOne({ _id: this._id });
                yield Redis_1.default.client.zincrby('comments', -1, String(this.parentId));
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
}
exports.default = Comment;
//# sourceMappingURL=Comment.js.map