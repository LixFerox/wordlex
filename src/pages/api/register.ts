import type { APIContext } from "astro";
import { turso } from "~/lib/turso";

export async function POST({ request }: APIContext) {
  const { username, puntuation } = await request.json();

  await turso.execute({
    sql: `
     INSERT INTO users (username, puntuation)
      VALUES (?, ?)
      ON CONFLICT(username)
      DO UPDATE SET puntuation = users.puntuation + excluded.puntuation;
    `,
    args: [username, puntuation],
  });

  return new Response("ok", { status: 200 });
}
