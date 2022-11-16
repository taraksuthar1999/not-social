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
exports.isAuthenticated = exports.validator = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Collections_1 = __importDefault(require("../db/Collections"));
const ResponseMessage_1 = require("../responses/ResponseMessage");
const User_1 = __importDefault(require("../models/User"));
const validator = (schema) => {
    return (req, res, next) => {
        try {
            const { error, value } = schema.validate(req.body);
            if (error === undefined)
                return next();
            throw new Error(error.details.map(err => err.message));
        }
        catch (error) {
            next(error);
        }
    };
};
exports.validator = validator;
const isAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token)
            return res.reply(ResponseMessage_1.customResponse['TOKEN_REQUIRED']);
        let payload = jsonwebtoken_1.default.verify(token, process.env.SECRET);
        if (!payload)
            return res.reply(ResponseMessage_1.customResponse["INVALID_TOKEN"]);
        const user = yield Collections_1.default.users.findOne({ email: payload.sub, token: token });
        if (!user)
            return res.reply(ResponseMessage_1.customResponse["USER_NOT_FOUND"]);
        req.user = new User_1.default(user);
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.isAuthenticated = isAuthenticated;
//# sourceMappingURL=index.js.map