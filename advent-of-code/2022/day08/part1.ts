export default ({ input }: Input) => {
  const data = input.split("\n").map((line) => {
    return line.split("").map(Number);
  });

  // Grid size
  const h = data.length;
  const w = data[0].length;

  // To store positions
  const trees: [number, number][] = [];

  // Left and right
  for (let y = 0; y < h; y++) {
    let [l, r] = [-1, -1];
    for (let x = 0; x < w; x++) {
      // Left
      if (data[y][x] > l) {
        trees.push([y, x]);
        l = data[y][x];
      }
      // Right
      if (data[y][w - x - 1] > r) {
        trees.push([y, w - x - 1]);
        r = data[y][w - x - 1];
      }
    }
  }

  // Up and down
  for (let x = 0; x < w; x++) {
    let [u, d] = [-1, -1];
    for (let y = 0; y < h; y++) {
      // Up
      if (data[y][x] > u) {
        trees.push([y, x]);
        u = data[y][x];
      }
      // Down
      if (data[h - y - 1][x] > d) {
        trees.push([h - y - 1, x]);
        d = data[h - y - 1][x];
      }
    }
  }

  // Dedupe
  const visibles = [...new Set(trees.map(([y, x]) => `${y},${x}`))]
    .map((v) => v.split(",").map(Number));

  // Number of visible trees
  return visibles.length;
};
