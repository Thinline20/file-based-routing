import Elysia from "elysia";
import { Option } from "effect";
import { watch } from "fs";

import { env } from "./lib/env";
import { getFiles, parsePaths } from "./lib/router/paths";
import { createRoute } from "./lib/router/create-route";
import { createServer } from "./lib/create-server";

async function main() {
  let elysia = await createServer();

  elysia.listen(env.PORT);

  console.log(`Elysia server is running at http://localhost:${env.PORT}/`);

  const watcher = watch(
    import.meta.dir,
    { recursive: true },
    async (event, filename) => {
      elysia.stop();
      elysia = await createServer();

      elysia.listen(env.PORT);

      console.log(`Elysia server is running at http://localhost:${env.PORT}/`);
    },
  );

  process.on("SIGINT", () => {
    console.log("Closing server...");
    watcher.close();

    process.exit(0);
  });
}

main();
