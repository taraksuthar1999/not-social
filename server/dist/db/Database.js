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
const dotenv_1 = __importDefault(require("dotenv"));
const mongodb_1 = require("mongodb");
const Collections_1 = __importDefault(require("./Collections"));
dotenv_1.default.config();
class Database {
    static init() {
        return __awaiter(this, void 0, void 0, function* () {
            mongodb_1.MongoClient.connect(process.env.MONGO_URL, (err, database) => {
                // this.count = this.count +1 //single connection
                // console.log(this.count)
                if (err)
                    console.log('Unable to connect to database');
                this.db = database === null || database === void 0 ? void 0 : database.db(process.env.DB);
                Collections_1.default.init(this.db);
            });
        });
    }
}
Database.count = 0;
exports.default = Database;
//# sourceMappingURL=Database.js.map