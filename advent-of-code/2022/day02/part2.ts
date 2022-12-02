export default ({ input }: Input) => {
  // Typings
  type Elf = "A" | "B" | "C";
  type You = "X" | "Y" | "Z";
  type Round = [Elf, You];

  // Parse input
  const data = input.split("\n").map((v) => v.split(" ")) as Round[];

  // Scoring
  const shape = { R: 1, P: 2, S: 3 };
  const round = { RR: 3, RP: 0, RS: 6, PR: 6, PP: 3, PS: 0, SR: 0, SP: 6, SS: 3 };

  // Mappers
  const elfMove = { A: "R", B: "P", C: "S" } as const;
  const youMove = {
    X: { A: "S", B: "R", C: "P" }, // Lose
    Y: { A: "R", B: "P", C: "S" }, // Draw
    Z: { A: "P", B: "S", C: "R" }, // Win
  } as const;

  return data
    .map(([e, y]) => [elfMove[e], youMove[y][e]])
    .map(([e, y]) => shape[y] + round[`${y}${e}`])
    .reduce((a, b) => a + b, 0); // Sum
};
