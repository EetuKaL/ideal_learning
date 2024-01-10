import { Pool } from "pg";
import { sqlCredentials } from "../../sqlCredentials";

export async function getUser(user_id: string) {
  const pool = new Pool(sqlCredentials);
  const client = await pool.connect();
  const userResult = await client.query({
    text: `
        SELECT first_name, last_name, user_email, user_password
        FROM public.users WHERE user_email = $1;
              `,
    values: [user_id],
  });
  client.release();
  await pool.end();

  return userResult.rows[0];
}
