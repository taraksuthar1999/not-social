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
const socket_io_1 = require("socket.io");
const Redis_1 = __importDefault(require("../db/Redis"));
class Socket {
    static init(server) {
        this.io = new socket_io_1.Server(server, { cors: {
                origin: process.env.ORIGIN,
                credentials: true
            } });
        this.io.on("connection", (socket) => {
            console.log(socket.id);
            socket.on('like', (postId, userId, callback) => __awaiter(this, void 0, void 0, function* () {
                console.log(userId);
                const count = yield Redis_1.default.client.zincrby('likes', 1, postId);
                yield Redis_1.default.client.zadd(`liked:${postId}`, Date.now(), userId);
                socket.broadcast.emit(`listen:like:${postId}`, Number(count));
                callback(true);
            }));
            socket.on('view', (postId) => __awaiter(this, void 0, void 0, function* () {
                const count = yield Redis_1.default.client.zincrby('views', 1, postId);
                socket.broadcast.emit(`listen:view:${postId}`, Number(count));
            }));
            socket.on('unlike', (postId, userId, callback) => __awaiter(this, void 0, void 0, function* () {
                const count = yield Redis_1.default.client.zincrby('likes', -1, postId);
                yield Redis_1.default.client.zrem(`liked:${postId}`, Date.now(), userId);
                socket.broadcast.emit(`listen:like:${postId}`, Number(count));
                callback(false);
            }));
            socket.on('likes', (postId, callback) => __awaiter(this, void 0, void 0, function* () {
                const count = yield Redis_1.default.client.zscore('likes', postId);
                callback(count);
            }));
            socket.on('comments', (postId, callback) => __awaiter(this, void 0, void 0, function* () {
                const count = yield Redis_1.default.client.zscore('comments', postId);
                callback(count);
            }));
            socket.on('views', (postId, callback) => __awaiter(this, void 0, void 0, function* () {
                const count = yield Redis_1.default.client.zscore('views', postId);
                callback(count);
            }));
            socket.on('isLiked', (postId, userId, callback) => __awaiter(this, void 0, void 0, function* () {
                const score = yield Redis_1.default.client.zscore(`liked:${postId}`, userId);
                callback(Boolean(score));
            }));
        });
    }
}
exports.default = Socket;
//# sourceMappingURL=Socket.js.map