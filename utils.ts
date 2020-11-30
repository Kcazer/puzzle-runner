import { walk } from "https://deno.land/std@0.167.0/fs/mod.ts";
import { parse } from "https://deno.land/std@0.167.0/flags/mod.ts";
import { basename, dirname } from "https://deno.land/std@0.167.0/path/mod.ts";
import * as Colors from "https://deno.land/std@0.167.0/fmt/colors.ts";

// Styling
const Style = {
  none: Colors.stripColor,
  tail: Colors.dim,
  join: Colors.gray,
  head: Colors.bold,
  time: Colors.magenta,
  value: Colors.yellow,
  error: Colors.brightRed,
  failure: Colors.brightRed,
  pending: Colors.brightBlue,
  success: Colors.brightGreen,
};

/**
 * Prefix the given path with `./` when necessary.
 * Dirty bypass for Deno relative imports rules.
 */
const getPath = (path: string) => {
  return path.startsWith("/") ? path : `./${path}`;
};

/**
 * Extract command line arguments and then enforce their types
 * (`parse` does not enforce arguments types outside of runtime)
 */
const getArguments = () => {
  const string = ["include", "exclude"];
  const alias = { i: "include", e: "exclude" };
  const args = parse(Deno.args, { string, alias });
  const include = args.include != null ? String(args.include) : undefined;
  const exclude = args.exclude != null ? String(args.exclude) : undefined;
  return { include, exclude };
};

/**
 * Returns a clean version of the input that only
 * contains digits, uppercase letters, and spaces
 */
const getCleanString = (value: string) => {
  return value.normalize("NFD").toUpperCase().replace(/[^0-9A-Z]+/g, " ");
};

/**
 * Return a function that can be used to detect if a string contains
 * all the characters from t
 * he given pattern, in the same order
 */
const getStringMatcher = (pattern: string) => {
  // Build various matcher for a given string
  const wordMatcher = (str: string) => str.replace(/[A-Z]/g, (c) => `${c}[^ ]*`);
  const abbrMatcher = (str: string) => str.replace(/[A-Z]/g, (c) => `(?:^| )${c}.*`);
  // Combine matcher builder into a single function
  const builders = [wordMatcher, abbrMatcher];
  const combined = (str: string) => `(?:${builders.map((fn) => fn(str)).join("|")})`;
  // Extract chunk and generate every matcher
  const cleaned = getCleanString(pattern).trim();
  const chunks = cleaned.split(" ").map(combined);
  const regex = new RegExp(chunks.join(".*"));
  return (value: string) => regex.test(getCleanString(value));
};

/**
 * Return a function used to detect if a given path matches
 * the required include or exclude pattern. By default, all
 * files are included and none are excluded. If a file match
 * both include and exclude filter, then it'll be excluded.
 */
const getFileMatcher = ({ include = "", exclude = "" }) => {
  const accept = getCleanString(include) ? getStringMatcher(include) : null;
  const reject = getCleanString(exclude) ? getStringMatcher(exclude) : null;
  return (path: string) => accept?.(path) !== false && reject?.(path) !== true;
};

/**
 * Recursively walk through a directory and return files
 * for which the extension matches the one provided.
 */
const getFileList = async (dir: string, extension: string) => {
  const files: string[] = [];
  const format = new RegExp(`\\.${getCleanString(extension)}$`, "i");
  const walker = walk(getPath(dir), { includeDirs: false, match: [format] });
  for await (const file of walker) files.push(file.path);
  return files.sort();
};

/**
 * Get the list of files that matches command line arguments.m
 * All non-root typescript files are considered puzzles.
 */
const getPuzzles = async () => {
  const isMatch = getFileMatcher(getArguments());
  const isPuzzle = (file: string) => /[/\\]/.test(file);
  return (await getFileList(".", "ts")).filter(isMatch).filter(isPuzzle);
};

/**
 * Load text files located in the same folder as the puzzle.
 * This is then used to populate a filename indexed object.
 */
const getInput = async (path: string) => {
  const input: Input = {};
  const files = await getFileList(dirname(path), "txt");
  for (const file of files) {
    const name = basename(file).replace(/\.txt$/, "");
    const data = await Deno.readTextFile(getPath(file));
    input[name] = data;
  }
  return input;
};

/**
 * Given the path of a puzzle, import the default export
 * and load all available input files in the folder. Then
 * run the puzzle, and return the result (or error if any)
 */
const runPuzzle = async (path: string): Promise<Result> => {
  console.log(`${formatPath(path)}`);
  console.log("\x1B[2A\x1B[?25l");

  try {
    const runner = (await import(getPath(path))).default;
    const input = await getInput(path);
    const start = performance.now();
    const value = await runner(input);
    const time = performance.now() - start;
    return { status: "success", value, time, path };
  } catch (err) {
    const error = (() => {
      if (err instanceof Error) return err.message;
      if (typeof err === "string") return err;
      return String(err);
    })();
    return { status: "failure", error, path };
  }
};

/**
 * Takes a path, separated by `/` or `\` and format it
 * in order to make the resulting string more stylish.
 */
const formatPath = (path: string) => {
  const clean = path.replace(/^[./\\]*(.*?)([/\\]index)?\.ts$/, "$1");
  const parts = clean.trim().split(/\s*[/\\](?:[A-Z0-9][\s_-]+)?/i);
  const tail = parts.slice(0, -1).map((part) => Style.tail(part));
  const head = parts.slice(-1).map((part) => Style.head(part));
  return [...tail, ...head].join(Style.join(" » "));
};

/**
 * Convert a number into a human readable time
 * Optionally add brackets around the result
 */
const formatTime = (time: number, brackets = false) => {
  const text = `${time.toFixed(2)}ms`;
  return Style.time(brackets ? `(${text})` : text);
};

/**
 * A value can be a string, a number or an array of any of these.
 * This function will do it's best to display it in a pretty way.
 */
const formatValue = (value: Output) => {
  const head = Style.success("┃ ");
  const text = (Array.isArray(value) ? value.join("\n") : `${value}`).trim();
  const lines = text.split("\n").map((line) => `${head}${Style.value(line)}`);
  return lines.join("\n");
};

/**
 * Same as `formatValue` but for errors. Uses red instead of green
 * and truncate the text to more or less fit the terminal width.
 */
const formatError = (error: string) => {
  const head = Style.failure("┃ ");
  const line = error.split("/n")[0].replace(/\s+/g, " ").trim();
  const text = line.length > 115 ? `${line.slice(0, 112)}...` : line;
  return `${head}${Style.error(Style.none(text))}`;
};

/**
 * Pretty print the result of a run.
 */
const printResult = (res: Result) => {
  if (res.status === "success") {
    const name = formatPath(res.path);
    const time = formatTime(res.time, true);
    console.log(`${name} ${time}`);
    console.log(formatValue(res.value));
  }
  if (res.status === "failure") {
    const name = formatPath(res.path);
    console.log(`${name}`);
    console.log(formatError(res.error));
  }
  console.log("");
};

const printSummary = (results: Result[]) => {
  const getLength = (str: string) => [...Style.none(str).normalize()].length;
  const getMaxLength = (strs: string[]) => Math.max(...strs.map(getLength));
  const pad = (str: string, size: number, align = "left") => {
    const length = Math.max(0, size - getLength(str));
    if (align === "left") return `${" ".repeat(length)}${str}`;
    if (align === "right") return `${str}${" ".repeat(length)}`;
    const [l, r] = [Math.floor(length / 2), Math.ceil(length / 2)];
    return `${" ".repeat(l)}${str}${" ".repeat(r)}`;
  };

  const lengths = [
    getMaxLength(results.map((r) => r.status)),
    getMaxLength(results.map((r) => formatPath(r.path))),
    getMaxLength(results.map((r) => "time" in r ? formatTime(r.time) : "")),
  ];

  const data = results.map((result) => [
    Style[result.status](result.status),
    formatPath(result.path),
    "time" in result ? formatTime(result.time) : "",
  ]);

  data.unshift(lengths.map((len) => "-".repeat(len)));
  data.unshift([
    pad("Status", lengths[0], "center"),
    pad("Puzzle", lengths[1], "center"),
    pad("Time", lengths[2], "center"),
  ]);
  data.unshift(lengths.map((len) => "-".repeat(len)));
  data.push(lengths.map((len) => "-".repeat(len)));

  const table = data.map((row) => [
    "",
    pad(row[0], lengths[0], "center"),
    pad(row[1], lengths[1], "right"),
    pad(row[2], lengths[2], "left"),
    "",
  ]);

  console.log(table.map((row) => row.join(" | ")).join("\n"));
};

export { getPuzzles, printResult, printSummary, runPuzzle };
