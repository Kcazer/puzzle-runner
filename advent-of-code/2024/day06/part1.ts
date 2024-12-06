export default ({ input }: Input) => {
  // Typings
  type Direction = "^" | ">" | "v" | "<";
  type DirectionConfig = { rot: Direction; dx: number; dy: number };

  // Configuration for movement and rotation
  const Config: Record<Direction, DirectionConfig> = {
    "^": { rot: ">", dx: 0, dy: -1 },
    ">": { rot: "v", dx: 1, dy: 0 },
    "v": { rot: "<", dx: 0, dy: 1 },
    "<": { rot: "^", dx: -1, dy: 0 },
  };

  // Build area as a 2D array of single characters (= section)
  const area = input.trim().split("\n").map((line) => line.trim().split(""));

  // Detect guards position and directions
  const guards = [...input.matchAll(/[>v^<]/g)].map((match) => {
    const y = Math.floor(match.index / (area.length + 1));
    const x = match.index - y * (area.length + 1);
    return { x, y, dir: match[0] as Direction };
  });

  // Follows a guard's round as she travels through the area
  const getRoundDetails = (x: number, y: number, dir: Direction) => {
    // Variables
    const guard = { x, y, dir };
    const keys = new Set<string>();
    const path: { x: number; y: number }[] = [];

    while (true) {
      // Update path
      path.push({ x: guard.x, y: guard.y });

      // Check if looping
      const key = `${guard.x},${guard.y},${guard.dir}`;
      if (!keys.has(key)) keys.add(key);
      else return { path, loop: true };

      // Rotate to not face a wall
      while (true) {
        const nx = guard.x + Config[guard.dir].dx;
        const ny = guard.y + Config[guard.dir].dy;
        if (area[ny]?.[nx] !== "#") break;
        guard.dir = Config[guard.dir].rot;
      }

      // Move the guard forwards
      guard.x += Config[guard.dir].dx;
      guard.y += Config[guard.dir].dy;

      // Check for out of bounds
      const isOutOfBounds = area[guard.y]?.[guard.x] == null;
      if (isOutOfBounds) return { path, exit: [guard.x, guard.y] };
    }
  };

  // Get path for the first guard
  const [{ x: _x, y: _y, dir: _dir }] = guards;
  const { path } = getRoundDetails(_x, _y, _dir);

  // Count the number of unique sections visited
  return new Set(path.map(({ x, y }) => `${x},${y}`)).size;
};
