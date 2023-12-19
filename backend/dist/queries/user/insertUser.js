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
exports.registerUser = void 0;
const pg_1 = require("pg");
function registerUser(user_email, user_password, firstname, lastname) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = new pg_1.Pool({
            host: "localhost",
            port: 5432,
            database: "postgres",
            user: "postgres",
            password: "kissa123",
        });
        const client = yield pool.connect();
        yield client.query({
            text: `
          INSERT INTO public.users(user_email, user_password, first_name, last_name)
          VALUES($1, $2, $3, $4)
          `,
            values: [user_email, user_password, firstname, lastname],
        });
        client.release();
        yield pool.end();
    });
}
exports.registerUser = registerUser;
