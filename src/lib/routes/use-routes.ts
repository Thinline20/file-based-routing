import Elysia from "elysia";
import { html } from "@elysiajs/html";
import swagger from "@elysiajs/swagger";

export const baseElysia = new Elysia().use(swagger()).use(html());

export function useRoute(elysia: typeof baseElysia, routes: Elysia[]) {
  if (routes.length === 0) {
    return elysia;
  }

  const newRoute = routes.shift();

  return useRoute(elysia.use(newRoute!), routes);
}
