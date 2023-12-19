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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = void 0;
const pg_1 = require("pg");
function getUser(user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = new pg_1.Pool({
            host: "localhost",
            port: 5432,
            database: "postgres",
            user: "postgres",
            password: "kissa123",
        });
        const client = yield pool.connect();
        const userResult = yield client.query({
            text: `
        SELECT first_name, last_name, user_email, user_password
        FROM public.users WHERE user_email = $1;
              `,
            values: [user_id],
        });
        client.release();
        yield pool.end();
        return userResult.rows[0];
    });
}
exports.getUser = getUser;
