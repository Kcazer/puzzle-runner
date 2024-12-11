export default ({ input }: Input) => {
  // Parse into into a 2D array of `{ x, y, value }` objects
  const data = input.split("\n").map((row, y) => {
    return row.split("").map((cell, x) => {
      return { x, y, value: +cell };
    });
  });

  // Initialize all trails, by finding all possible starting points
  const paths = data.flat().filter((item) => item.value === 0).map((item) => [item]);

  // Iterate as long as we didn't find all the possible paths
  while (paths.some((path) => path.at(-1)?.value !== 9)) {
    // Get current cell
    const path = paths.shift();
    const cell = path?.at(-1);
    if (!path || !cell) break;
    // Get adjacent cells
    const { x, y, value } = cell;
    const cellL = data[y][x - 1];
    const cellR = data[y][x + 1];
    const cellU = data[y - 1]?.[x];
    const cellD = data[y + 1]?.[x];
    // Store new paths if they're valid
    if (cellL?.value === value + 1) paths.push([...path, cellL]);
    if (cellR?.value === value + 1) paths.push([...path, cellR]);
    if (cellU?.value === value + 1) paths.push([...path, cellU]);
    if (cellD?.value === value + 1) paths.push([...path, cellD]);
  }

  // We have the number of path from part 1
  return paths.length;
};
