"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const AuthRoutes_1 = __importDefault(require("./routes/AuthRoutes"));
const PostRoutes_1 = __importDefault(require("./routes/PostRoutes"));
const CommentRoutes_1 = __importDefault(require("./routes/CommentRoutes"));
const SeedRoutes_1 = __importDefault(require("./routes/SeedRoutes"));
const Database_1 = __importDefault(require("./db/Database"));
const ResponseMessage_1 = require("./responses/ResponseMessage");
const Redis_1 = __importDefault(require("./db/Redis"));
const Socket_1 = __importDefault(require("./socket/Socket"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
dotenv_1.default.config();
Database_1.default.init();
Redis_1.default.init();
Socket_1.default.init(server);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
app.use((_req, res, next) => {
    res.reply = ({ code, message }, data = {}, header = undefined) => {
        res.status(code).header(header).json({ message, data });
    };
    next();
});
app.use((req, res, next) => {
    console.log(`${req.method} url::${req.url}`);
    next();
});
app.use("/api/v1/auth", AuthRoutes_1.default);
app.use("/api/v1/post", PostRoutes_1.default);
app.use("/api/v1/comment", CommentRoutes_1.default);
app.use("/api/v1", SeedRoutes_1.default);
app.use((err, _req, res, next) => {
    err.message ? res.reply({ code: 405, message: err.message }) :
        res.reply(ResponseMessage_1.customResponse['SERVER_ERROR']);
});
const PORT = Number(process.env.PORT);
const HOST = '0.0.0.0';
server.listen(PORT, HOST, () => console.log(`Server up and running on ${HOST}:${PORT}`));
//# sourceMappingURL=Server.js.map