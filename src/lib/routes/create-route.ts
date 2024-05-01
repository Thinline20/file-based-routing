import Elysia from "elysia";

export function createRoute(
  path: string,
  handler: Function,
  method: "get" | "post" | "put" | "delete" = "get",
) {
  const elysia = new Elysia();

  switch (method) {
    case "get":
      return elysia.get(path, handler);
    case "post":
      return elysia.post(path, handler);
    case "put":
      return elysia.put(path, handler);
    case "delete":
      return elysia.delete(path, handler);
  }
}
