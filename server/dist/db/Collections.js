"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Collections {
    static init(db) {
        this.users = db === null || db === void 0 ? void 0 : db.collection('users');
        this.post = db === null || db === void 0 ? void 0 : db.collection('posts');
        this.comments = db === null || db === void 0 ? void 0 : db.collection('comments');
    }
}
exports.default = Collections;
//# sourceMappingURL=Collections.js.map