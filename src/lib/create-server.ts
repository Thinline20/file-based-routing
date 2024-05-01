import { baseElysia, useRoute } from "./routes/use-routes";

export function createServer() {
  return useRoute(baseElysia, []);
}