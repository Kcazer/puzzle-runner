export default ({ input }: Input) => {
  const lines = input.split("\n");
  const width = lines[0].length;
  const height = lines.length;

  const res = { x: 0, y: 0, n: 0 };
  while (res.y < height) {
    const char = lines[res.y][res.x % width];
    if (char === "#") res.n += 1;
    res.x += 3;
    res.y += 1;
  }

  return res.n;
};
