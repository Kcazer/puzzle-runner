import Puzzle from "https://esm.sh/nonogram-solver@2.0.0/src/Puzzle";
import Strategy from "https://esm.sh/nonogram-solver@2.0.0/src/Strategy";
import allSolvers from "https://esm.sh/nonogram-solver@2.0.0/src/allSolvers";

export default ({ input }: Input) => {
  // Parse input into rows and columns values
  const [columns, rows] = input.split("\n").map((line) => {
    return line.trim().split("/").map((values) => {
      return values.split(" ").map(Number);
    });
  });

  // Solve the nonogram
  const puzzle = new Puzzle({ rows, columns });
  const strategy = new Strategy(allSolvers);
  strategy.solve(puzzle);

  // Extract the solution and print it
  const res = puzzle.toJSON().content as number[];
  const chars = res.map((val) => ["⬛", "✖", "⬜"][val + 1]);
  const lines = Array.from({ length: chars.length / rows.length }, (_, i) => {
    return chars.slice(i * columns.length, (i + 1) * columns.length).join("");
  });

  return [...lines, "[écureuil]"];
};
