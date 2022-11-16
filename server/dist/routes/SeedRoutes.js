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
exports.company = void 0;
const express_1 = require("express");
const faker_1 = require("@faker-js/faker");
const Collections_1 = __importDefault(require("../db/Collections"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Redis_1 = __importDefault(require("../db/Redis"));
const router = (0, express_1.Router)();
exports.company = ["simform", "tatvasoft", "yudiz", "crestdata", "motadata", "gatway"];
router.get("/seed", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < 5; i++) {
        let user = {
            email: faker_1.faker.internet.email(),
            userName: faker_1.faker.name.firstName(),
            password: bcryptjs_1.default.hashSync("Tarak12345", 10),
            company: exports.company[Math.floor(Math.random() * 6)],
            createdAt: new Date()
        };
        const { insertedId } = yield Collections_1.default.users.insertOne(user);
        for (let j = 0; j < 5; j++) {
            let newPost = {
                tag: faker_1.faker.helpers.arrayElements(['tech', 'finance', 'sports', 'property']),
                title: faker_1.faker.lorem.sentence(8),
                body: faker_1.faker.lorem.paragraphs(3, '<br/>\n'),
                createdAt: faker_1.faker.date.recent(),
                userId: insertedId
            };
            const post = yield Collections_1.default.post.insertOne(newPost);
            yield Redis_1.default.client.zadd('comments', 0, post.insertedId);
            yield Redis_1.default.client.zadd('likes', 0, post.insertedId);
            yield Redis_1.default.client.zadd('views', 0, post.insertedId);
        }
    }
    res.status(200).send("seed success.");
}));
router.get('/empty', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield Collections_1.default.users.deleteMany({});
    yield Collections_1.default.post.deleteMany({});
    yield Collections_1.default.comments.deleteMany({});
    res.status(200).send("db empty");
}));
exports.default = router;
//# sourceMappingURL=SeedRoutes.js.map