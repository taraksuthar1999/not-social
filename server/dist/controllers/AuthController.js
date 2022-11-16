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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const Collections_1 = __importDefault(require("../db/Collections"));
const ResponseMessage_1 = require("../responses/ResponseMessage");
const SeedRoutes_1 = require("../routes/SeedRoutes");
class AuthController {
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { email, password, userName } = req.body;
                const userNameExists = yield Collections_1.default.users.findOne({ userName });
                const userEmailExists = yield Collections_1.default.users.findOne({ email });
                if (userNameExists)
                    return res.reply({ code: 400, message: 'User name taken.' });
                if (userEmailExists)
                    return res.reply({ code: 400, message: 'User already exists.' });
                password = bcryptjs_1.default.hashSync(password, 10);
                let randomCompany = SeedRoutes_1.company[Math.floor(Math.random() * 6)];
                yield Collections_1.default.users.insertOne({ email, userName, password, company: randomCompany, createdAt: new Date() });
                return res.reply(ResponseMessage_1.customResponse['REGISTER_SUCCESS']);
            }
            catch (error) {
                console.log(error);
                res.reply(ResponseMessage_1.customResponse['REGISTER_ERROR']);
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const data = yield Collections_1.default.users.findOne({ email });
                if (!data || !bcryptjs_1.default.compareSync(password, data.password))
                    return res.reply(ResponseMessage_1.customResponse['INVALID_USER_CRED']);
                const user = new User_1.default(data);
                yield user.login();
                const userRes = Object.keys(user).filter((key) => {
                    if (key !== 'password')
                        return key;
                }).reduce((acc, key) => {
                    acc[key] = user[key];
                    return acc;
                }, {});
                res.reply(ResponseMessage_1.customResponse['LOGIN_SUCCESS'], userRes);
            }
            catch (error) {
                res.reply(ResponseMessage_1.customResponse['LOGIN_ERROR']);
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield req.user.logout();
                res.reply({ code: 200, message: "Logged out successfully" });
            }
            catch (error) {
                res.reply({ code: 500, message: "Logged out Error" });
            }
        });
    }
    profile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userRes = Object.keys(req.user).filter((key) => {
                    if (key !== 'password')
                        return key;
                }).reduce((acc, key) => {
                    acc[key] = req.user[key];
                    return acc;
                }, {});
                res.reply(ResponseMessage_1.customResponse['FETCH_PROFILE_SUCCESS'], userRes);
            }
            catch (error) {
                console.log(error);
                res.reply(ResponseMessage_1.customResponse["FETCH_PROFILE_ERROR"]);
            }
        });
    }
}
exports.default = AuthController;
//# sourceMappingURL=AuthController.js.map