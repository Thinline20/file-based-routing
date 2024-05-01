import { Glob } from "bun";
import { Effect, Option } from "effect";
import type { FileType } from "~/types/file";

export const FILE_EXTENSIONS = ["js", "ts", "jsx", "tsx"] as const;

export class NoFilesError {
  readonly _tag = "NoFilesError";
}

export async function getFiles(): Promise<Option.Option<string[]>> {
  const pathGlob = new Glob(`src/pages/**/*.{${FILE_EXTENSIONS.join(",")}}`);

  const filesIterator = pathGlob.scan(".");

  const files: string[] = [];

  for await (const file of filesIterator) {
    files.push(file);
  }

  if (files.length === 0) {
    return Option.none();
  }

  return Option.some(files);
}

export function parsePaths(files: string[]): FileType[] {
  return process.platform === "win32"
    ? parsePathsWindows(files)
    : parsePathsPosix(files);
}

function parsePathsWindows(files: string[]): FileType[] {
  return files.map((value) => {
    const fullPath = value.replace("src\\pages\\", "");
    const pathParts = fullPath.split("\\").filter(Boolean);
    const file = pathParts.pop() as string;
    const [filename, extension] = file.split(".");
    pathParts.push(filename);

    const path = pathParts.join("/").replace("/index", "");

    return {
      path: path === "index" ? "" : path,
      pathParts,
      filename,
      extension: extension as FileType["extension"],
      filePath: value,
    } as FileType;
  });
}

function parsePathsPosix(files: string[]): FileType[] {
  return files.map((value) => {
    const fullPath = value.replace("src/pages/", "");
    const pathParts = fullPath.split("/").filter(Boolean);
    const file = pathParts.pop() as string;
    const [filename, extension] = file.split(".");
    pathParts.push(filename);

    const path = pathParts.join("/").replace("/index", "");

    return {
      path: path === "index" ? "" : path,
      pathParts,
      filename,
      extension: extension as FileType["extension"],
      filePath: value,
    } as FileType;
  });
}
