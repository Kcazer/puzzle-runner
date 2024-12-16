export default ({ input }: Input) => {
  // Show animation ?
  const ANIMATE = false;

  // Parse input, extract dimensions
  const [input1, input2] = input.split("\n\n");

  // Moves sent to the robot
  const moves = [...input2.match(/[<^v>]/g) ?? []] as ("^" | "v" | "<" | ">")[];

  // Extract walls, boxes and robot positions from the area cells
  const cells = input1.split("\n").flatMap((r, y) => r.split("").map((t, x) => ({ y, x, t })));
  const boxes = cells.filter((c) => c.t === "O").map(({ x, y }) => [{ y, x: 2 * x }, { y, x: 2 * x + 1 }]);
  const walls = cells.filter((c) => c.t === "#").map(({ x, y }) => [{ y, x: 2 * x }, { y, x: 2 * x + 1 }]);
  const robot = cells.filter((c) => c.t === "@").map(({ x, y }) => [{ y, x: 2 * x }]).pop();

  // Shouldn't happen
  if (!robot) throw new Error("No robot found");

  // Extract width and height of the area
  const flat = [...boxes, ...walls, robot].flat();
  const width = Math.max(...flat.map(({ x }) => x)) + 1;
  const height = Math.max(...flat.map(({ y }) => y)) + 1;

  // Map moves to deltas
  const deltas = { "^": { dy: -1, dx: 0 }, "v": { dy: 1, dx: 0 }, "<": { dy: 0, dx: -1 }, ">": { dy: 0, dx: 1 } };

  // Display the area on screen
  const screen = [...Array(height)].map(() => Array(width));
  const display = (rewind = false) => {
    screen.forEach((r) => r.fill("⬜️"));
    robot.forEach(({ y, x }) => screen[y][x] = "🤖");
    walls.forEach((cells) => cells.forEach(({ y, x }) => screen[y][x] = "🟫"));
    boxes.forEach((cells) => cells.forEach(({ y, x }) => screen[y][x] = "🟩"));
    if (rewind) console.log("\x1b[1A".repeat(height + 1));
    console.log(screen.map((r) => r.join("")).join("\n"));
  };

  // Store walls and boxes in hashmap for performance
  const getKey = (y: number, x: number) => `${y},${x}`;
  const boxesHash = new Map(boxes.flatMap((b) => b.map((c) => [getKey(c.y, c.x), b])));
  const wallsHash = new Map(walls.flatMap((w) => w.map((c) => [getKey(c.y, c.x), w])));

  // Move the robot in the choosen direction
  const move = (dy: number, dx: number) => {
    // List moving entities and their cells
    const entities = new Set([robot]);
    const subcells = [...entities].flat();
    // Iterate over the subcells
    for (let i = 0; i < subcells.length; i++) {
      // Compute key for future position
      const ny = subcells[i].y + dy;
      const nx = subcells[i].x + dx;
      const key = getKey(ny, nx);
      // Stop if the cell is a wall
      if (wallsHash.get(key)) return false;
      // Ignore if empty or already known box
      const box = boxesHash.get(key);
      if (!box || entities.has(box)) continue;
      // Add box to entities and subcells
      subcells.push(...box);
      entities.add(box);
    }
    // Then move all the cells
    subcells.forEach(({ y, x }) => boxesHash.delete(getKey(y, x)));
    subcells.forEach((subcell) => ((subcell.y += dy), (subcell.x += dx)));
    entities.forEach((ent, idx) => idx && ent.forEach(({ y, x }) => boxesHash.set(getKey(y, x), ent)));
  };

  // Move the robot
  if (ANIMATE) display();
  for (let i = 0; i < moves.length; i++) {
    const dir = deltas[moves[i]];
    move(dir.dy, dir.dx);
    if (ANIMATE) display(true);
  }

  const positions = boxes.map((cells) => {
    const y = Math.min(...cells.map(({ y }) => y));
    const x = Math.min(...cells.map(({ x }) => x));
    return 100 * y + x;
  });

  return positions.reduce((sum, pos) => sum + pos, 0);
};
