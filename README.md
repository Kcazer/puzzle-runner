# Puzzle runner

A simple Deno based runner for coding puzzles

## Usage

### Create a new puzzle

Every non-root level `.ts` file is considered a puzzle.\
Each puzzle must have a default export returning its solution.

### Manage puzzle inputs

Every `.txt` file in the same folder will be passed as function argument.

### Running a puzzle

To run a puzzle, simply use `./run.sh`, either directly, or with arguments :

- `-i` / `--include` : include only the puzzles matching the given pattern
- `-e` / `--exclude` : exclude puzzles whose path match the given pattern

## Example

Given two input files containing a number per line :

- Compute the sum of each file
- Return the product of every sums

```ts
# /sample/inputA.txt
1
2
3

# /sample/inputB.txt
5
5

# /sample/puzzle.ts
export default ({ inputA, inputB }: Input) => {
  const sumA = inputA.split("\n").reduce((s, v) => s + +v, 0);
  const sumB = inputB.split("\n").reduce((s, v) => s + +v, 0);
  return sumA * sumB;
};

# Running the puzzle
./run.sh -i "sample puz"
```
