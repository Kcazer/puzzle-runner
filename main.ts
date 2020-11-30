import { getPuzzles, printResult, printSummary, runPuzzle } from "./utils.ts";

const puzzles = await getPuzzles();
const results: Result[] = [];

for (const puzzle of puzzles) {
  const result = await runPuzzle(puzzle);
  results.push(result);
  printResult(result);
}

if (results.length) printSummary(results);
