export default ({ input }: Input) => {
  // Typings
  type Entity = { y: number; x: number };
  type Direction = { dy: number; dx: number };

  // Show animation ?
  const ANIMATE = false;

  // Parse input
  const [inputArea, inputOrders] = input.split("\n\n");
  const area = inputArea.split("\n").map((row) => row.split(""));
  const commands = [...inputOrders.match(/./g) ?? []] as ("^" | "v" | "<" | ">")[];

  // Map commands to directions
  const directions = {
    "^": { dy: -1, dx: 0 },
    "v": { dy: 1, dx: 0 },
    "<": { dy: 0, dx: -1 },
    ">": { dy: 0, dx: 1 },
  };

  // Create a little object containing the robot position
  const index = inputArea.indexOf("@");
  const robotX = index % (area.length + 1);
  const robotY = Math.floor(index / (area.length + 1));
  const robot = { y: robotY, x: robotX };

  // Try to move an entity in the given direction
  const move = (ent: Entity, dir: Direction) => {
    const [sy, sx] = [ent.y, ent.x];
    const [ty, tx] = [sy + dir.dy, sx + dir.dx];
    const [src, dst] = [area[sy]?.[sx], area[ty]?.[tx]];
    if (src !== "O" && src !== "@") throw new Error("Unmovable entity");
    if (dst == null || dst === "#") return false;
    if (dst === "." || move({ y: ty, x: tx }, dir)) {
      const temp = [area[sy][sx], area[ty][tx]];
      [area[ty][tx], area[sy][sx]] = temp;
      return true;
    }
    return false;
  };

  // Display the area
  const print = (rewind = false) => {
    if (rewind) console.log("\x1b[1A".repeat(area.length + 1));
    const pretty = area
      .map((row) => row.join("")).join("\n")
      .replaceAll("#", "🟫")
      .replaceAll(".", "⬜️")
      .replaceAll("O", "🟩")
      .replaceAll("@", "🤖");
    console.log(pretty);
  };

  // Move the robot
  if (ANIMATE) print();
  commands.forEach((command) => {
    const dir = directions[command];
    if (!move(robot, dir)) return;
    if (ANIMATE) print(true);
    robot.y += dir.dy;
    robot.x += dir.dx;
  });

  // Compute position of every cell, then extract boxes
  const cells = area.flatMap((r, y) => r.map((c, x) => ({ y, x, c })));
  const boxes = cells.filter(({ c }) => c === "O");

  // Compute score
  return boxes.reduce((sum, box) => sum + box.y * 100 + box.x, 0);
};
