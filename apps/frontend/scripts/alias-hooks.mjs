import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

/**
 * Resolves the `@/*` TypeScript path alias for `node --test`, which runs the
 * source files directly and therefore does not read `tsconfig.json` paths.
 */
const SRC_DIR = path.resolve(import.meta.dirname, "../src");
const CANDIDATE_SUFFIXES = [".ts", ".tsx", "/index.ts"];

export function resolve(specifier, context, nextResolve) {
  if (!specifier.startsWith("@/")) {
    return nextResolve(specifier, context);
  }

  const base = path.join(SRC_DIR, specifier.slice(2));
  const resolved =
    CANDIDATE_SUFFIXES.map((suffix) => base + suffix).find(existsSync) ?? base;

  return nextResolve(pathToFileURL(resolved).href, context);
}
