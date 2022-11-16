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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Common_1 = require("./Common");
const Helper_1 = require("../Helper");
const Collections_1 = __importDefault(require("../db/Collections"));
const Redis_1 = __importDefault(require("../db/Redis"));
class Post extends Common_1.Common {
    constructor(obj) {
        super();
        this._id = obj === null || obj === void 0 ? void 0 : obj._id;
        this.body = obj === null || obj === void 0 ? void 0 : obj.title;
        this.title = obj === null || obj === void 0 ? void 0 : obj.body;
        this.userId = obj === null || obj === void 0 ? void 0 : obj.userId;
        this.tags = obj === null || obj === void 0 ? void 0 : obj.tags;
    }
    setId(id) {
        this._id = id;
        return this;
    }
    setUserId(id) {
        this.userId = id;
        return this;
    }
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            let slug = Helper_1.Helper.slugify(this.title);
            let insetObj = {
                body: this.body,
                title: this.title,
                userId: this.userId,
                tags: this.tags,
                slug
            };
            try {
                const { insertedId } = yield Collections_1.default.post.insertOne(insetObj);
                yield Redis_1.default.client.zadd("likes", 0, insertedId);
                yield Redis_1.default.client.zadd("comments", 0, insertedId);
                yield Redis_1.default.client.zadd("views", 0, insertedId);
            }
            catch (error) {
                throw new Error('Post create error.');
            }
        });
    }
    edit(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            let updatedAt = new Date();
            obj = Object.assign(Object.assign({}, obj), { updatedAt });
            try {
                yield Collections_1.default.post.updateOne({ _id: this._id }, obj);
            }
            catch (error) {
                throw new Error();
            }
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Collections_1.default.post.deleteOne({ _id: this._id, userId: this.userId });
            }
            catch (error) {
                console.log(error);
                throw new Error();
            }
        });
    }
    getPost() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Collections_1.default.post.aggregate([
                    {
                        $match: {
                            _id: this._id
                        }
                    }, {
                        $lookup: {
                            from: "comments",
                            let: { id: "$_id" },
                            pipeline: [
                                {
                                    $match: { $expr: { $eq: ["$parentId", "$$id"] } }
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
                                }, {
                                    $sort: {
                                        createdAt: -1
                                    }
                                }
                            ],
                            as: 'comments'
                        }
                    },
                    {
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
                    }
                ]).toArray();
            }
            catch (error) {
                throw new Error();
            }
        });
    }
    getAll() {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postlist = [];
                const posts = yield Collections_1.default.post.aggregate([
                    {
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
                    }, {
                        $limit: 30
                    }, {
                        $sort: {
                            createdAt: -1
                        }
                    }
                ]).toArray();
                try {
                    for (var _d = true, posts_1 = __asyncValues(posts), posts_1_1; posts_1_1 = yield posts_1.next(), _a = posts_1_1.done, !_a;) {
                        _c = posts_1_1.value;
                        _d = false;
                        try {
                            let post = _c;
                            let newPost = Object.assign(Object.assign({}, post), { likes: yield Redis_1.default.client.zscore('likes', post._id), views: yield Redis_1.default.client.zscore('views', post._id), comments: yield Redis_1.default.client.zscore('comments', post._id), isLiked: this.userId ? Boolean(yield Redis_1.default.client.zscore(`liked:${post._id}`, String(this.userId))) : false });
                            postlist.push(newPost);
                        }
                        finally {
                            _d = true;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = posts_1.return)) yield _b.call(posts_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                ;
                return postlist;
            }
            catch (error) {
                console.log(error);
                throw new Error();
            }
        });
    }
}
exports.default = Post;
//# sourceMappingURL=Post.js.map