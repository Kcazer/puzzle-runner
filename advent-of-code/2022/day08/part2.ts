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

  // Iterate each tree and compute scenic score
  const scored = visibles.map(([y, x]) => {
    const scores = { l: 0, r: 0, u: 0, d: 0 };
    const height = data[y][x]; // Tree height
    // Left score
    for (let xx = x - 1; xx >= 0; xx--) {
      scores.l++;
      if (data[y][xx] >= height) break;
    }
    // Right score
    for (let xx = x + 1; xx < w; xx++) {
      scores.r++;
      if (data[y][xx] >= height) break;
    }
    // Up score
    for (let yy = y - 1; yy >= 0; yy--) {
      scores.u++;
      if (data[yy][x] >= height) break;
    }
    // Down score
    for (let yy = y + 1; yy < h; yy++) {
      scores.d++;
      if (data[yy][x] >= height) break;
    }
    // Compute score
    const score = scores.l * scores.r * scores.u * scores.d;
    return { y, x, scores, score };
  });

  // Biggest score
  const best = scored.sort((a, b) => b.score - a.score)[0];
  return best.score;
};
