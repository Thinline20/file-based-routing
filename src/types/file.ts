export type FileType = {
  readonly _tag: "FileType";
  path: string;
  pathParts: string[];
  filename: string;
  extension: "js" | "ts" | "jsx" | "tsx";
  filePath: string;
};
