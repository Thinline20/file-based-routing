import Elysia from "elysia";
import { Option } from "effect";
import { html } from "@elysiajs/html";

import { env } from "./lib/env";
import { getFiles, parsePaths } from "./lib/routes/paths";
import { createRoute } from "./lib/routes/create-route";
import swagger from "@elysiajs/swagger";

const files = await getFiles();
const paths = Option.getOrElse(files, () => [] as string[]);
const parsedPaths = parsePaths(paths);
const routes: Elysia[] = [];

for (const path of parsedPaths) {
  const module = await import(path.filePath);

  if (path.extension === "jsx" || path.extension === "tsx") {
    routes.push(createRoute(path.path, () => module.default(), "get"));
  } else {
    if (module.GET !== undefined) {
      routes.push(createRoute(path.path, module.GET, "get"));
    }
  }

  if (module.POST !== undefined) {
    routes.push(createRoute(path.path, module.POST, "post"));
  }

  if (module.PUT !== undefined) {
    routes.push(createRoute(path.path, module.PUT, "put"));
  }

  if (module.DELETE !== undefined) {
    routes.push(createRoute(path.path, module.DELETE, "delete"));
  }
}


const elysia = useRoute(baseElysia, routes);

elysia.listen(env.PORT);
// .get("*", async ({ params }) => {
//   const param: string = params["*"];

//   const path = parsedPaths.find((value) => value.path === param);

//   if (!path) {
//     console.log(`No path found for ${param}`);
//     return;
//   }

//   const module = await import(path.filePath);

//   return module.default();
// })
// .listen(env.PORT);

console.log(`Elysia server is running at http://localhost:${env.PORT}/`);
