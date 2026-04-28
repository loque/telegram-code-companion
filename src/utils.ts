import { readFileSync } from "fs";
import { join } from "path";

export function readFile(path: string): string {
  return readFileSync(join(__dirname, path), "utf-8");
}
