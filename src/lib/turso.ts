import { createClient } from "@libsql/client";
import { TURSO_TOKEN, TURSO_URL } from "astro:env/server";

export const turso = createClient({
  url: TURSO_URL,
  authToken: TURSO_TOKEN,
});

export async function getUsers() {
  const data = await turso.execute({
    sql: "SELECT * FROM users",
  });

  return data.rows.map((row: any) => ({
    name: row.username,
    score: row.puntuation,
  }));
}
