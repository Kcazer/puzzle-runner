type Tuple = [y: number, x: number];

const moves = [
  [[1, 1], [1, 1], [1, 0], [1, -1], [1, -1]],
  [[1, 1], [0, 0], [0, 0], [0, 0], [1, -1]],
  [[0, 1], [0, 0], [0, 0], [0, 0], [0, -1]],
  [[-1, 1], [0, 0], [0, 0], [0, 0], [-1, -1]],
  [[-1, 1], [-1, 1], [-1, 0], [-1, -1], [-1, -1]],
];

const _display = (positions: Tuple[]) => {
  // Compute min-max for x and y
  const min = { x: Infinity, y: Infinity };
  const max = { x: -Infinity, y: -Infinity };
  positions.forEach(([y, x]) => {
    min.x = Math.min(min.x, x);
    min.y = Math.min(min.y, y);
    max.x = Math.max(max.x, x);
    max.y = Math.max(max.y, y);
  });

  // Create an array of the right size
  const output = Array.from({ length: max.y - min.y + 1 }, () => {
    return Array.from({ length: max.x - min.x + 1 }, () => ".");
  });

  // Update each cell
  positions.forEach(([y, x]) => {
    output[y - min.y][x - min.x] = "#";
  });

  // Display
  console.log(output.map((line) => line.join("")).join("\n"));
};

export default ({ input }: Input) => {
  const data = input.split("\n").flatMap((line) => {
    const [dir, dist] = line.split(" ");
    if (dir === "R") return Array(+dist).fill([0, +1]);
    if (dir === "L") return Array(+dist).fill([0, -1]);
    if (dir === "U") return Array(+dist).fill([-1, 0]);
    if (dir === "D") return Array(+dist).fill([+1, 0]);
    return [0, 0];
  });

  const rope: Tuple[] = Array.from({ length: 10 }, () => [0, 0]);
  const path: Tuple[] = [[...rope.at(-1)!]];

  for (const [hdy, hdx] of data) {
    // Move head
    rope[0][0] += hdy;
    rope[0][1] += hdx;
    // Iterate each knot
    for (let i = 1; i < rope.length; i++) {
      // Lookup knot move
      const my = rope[i][0] - rope[i - 1][0];
      const mx = rope[i][1] - rope[i - 1][1];
      const [tdy, tdx] = moves[my + 2][mx + 2];
      // Move knot and record
      rope[i][0] += tdy;
      rope[i][1] += tdx;
    }
    // Record tail
    path.push([...rope.at(-1)!]);
  }

  // _display(path);

  const dedupe = new Set(path.map(([y, x]) => `${y},${x}`));
  return dedupe.size;
};
