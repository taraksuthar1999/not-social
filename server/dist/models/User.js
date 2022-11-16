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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Common_1 = require("./Common");
const Collections_1 = __importDefault(require("../db/Collections"));
class User extends Common_1.Common {
    constructor(obj) {
        super();
        this._id = obj._id;
        this.email = obj.email;
        this.userName = obj.userName;
        this.password = obj.password;
        this.company = obj.company;
        this.createdAt = obj.createdAt;
        this.updatedAt = obj.updatedAt;
        this.token = obj.token;
    }
    get Id() {
        return this._id;
    }
    get UserName() {
        return this.userName;
    }
    login() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.token = jsonwebtoken_1.default.sign({ sub: this.email }, 'secret', { expiresIn: '24h' });
                yield Collections_1.default.users.updateOne({ _id: this._id }, { $set: { token: this.token } });
                return this;
            }
            catch (error) {
                throw new Error('Login error.');
            }
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.token = '';
                yield Collections_1.default.users.updateOne({ _id: this._id }, { $set: { token: this.token } });
                return this;
            }
            catch (error) {
                throw new Error('Logout error.');
            }
        });
    }
}
exports.default = User;
//# sourceMappingURL=User.js.map