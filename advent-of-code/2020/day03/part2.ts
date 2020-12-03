export default ({ input }: Input) => {
  const lines = input.split("\n");
  const width = lines[0].length;
  const height = lines.length;

  const getTreeCount = (dx: number, dy: number) => {
    const res = { x: 0, y: 0, n: 0 };
    while (res.y < height) {
      const char = lines[res.y][res.x % width];
      if (char === "#") res.n += 1;
      res.x += 3;
      res.y += 1;
    }
    return res.n;
  };

  const patterns = [[1, 1], [3, 1], [5, 1], [7, 1], [1, 2]];
  const results = patterns.map(([dx, dy]) => getTreeCount(dx, dy));
  const result = results.reduce((r, v) => r * v, 1);

  return result;
};
