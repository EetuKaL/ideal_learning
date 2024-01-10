import { Pool } from "pg";
import { sqlCredentials } from "../../sqlCredentials";

export async function registerUser(
  user_email: string,
  user_password: string,
  firstname?: string,
  lastname?: string
) {
  const pool = new Pool(sqlCredentials);
  const client = await pool.connect();
  await client.query({
    text: `
          INSERT INTO public.users(user_email, user_password, first_name, last_name)
          VALUES($1, $2, $3, $4)
          `,
    values: [user_email, user_password, firstname, lastname],
  });
  client.release();
  await pool.end();
}
