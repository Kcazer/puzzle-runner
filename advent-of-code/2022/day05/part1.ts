export default ({ input }: Input) => {
  // Extract crate pattern and move list
  const [crates, moves] = input.split("\n\n").map((line) => line.split("\n"));

  // Parse crates
  const size = Number(crates.pop()?.trim().split(" ").pop());
  const data: string[][] = Array(size).fill(null).map(() => []);
  crates.forEach((line) => {
    for (let i = 0; i < size; i++) {
      const crate = line[i * 4 + 1];
      if (crate === " ") continue;
      data[i].push(crate);
    }
  });

  // Process moves
  moves.forEach((line) => {
    const parsed = /(\d+) from (\d+) to (\d+)/.exec(line)!;
    const [, count, from, to] = parsed.map(Number);
    for (let i = 0; i < count; i++) {
      data[to - 1].unshift(data[from - 1].shift()!);
    }
  });

  // Result
  return data.map((line) => line.at(0)).join("");
};
