import Elysia from "elysia";
import { Option } from "effect";

import { baseElysia, useRoutes } from "./router/use-routes";
import { createRoute } from "./router/create-route";
import { getFiles, parsePaths } from "./router/paths";

export async function createServer() {
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

  return useRoutes(baseElysia, routes);
}
