export default ({ input }: Input) => {
  // Get area size and robot details
  const [size, ...rows] = input.split("\n");
  const [w, h] = size.split(" ").map(Number);
  const data = rows.map((row) => {
    const res = [...row.match(/-?\d+/g) ?? []];
    const [x, y, dx, dy] = res.map(Number);
    return { x, y, dx, dy };
  });

  // Use positive speeds
  data.forEach((robot) => {
    robot.dy = ((robot.dy % h) + h) % h;
    robot.dx = ((robot.dx % w) + h) % w;
  });

  // Prepare quadrants
  const midY = (h - 1) / 2;
  const midX = (w - 1) / 2;
  const count = [0, 0, 0, 0];

  // Update count based on robot position
  const updateCount = (y: number, x: number) => {
    if (y < midY && x < midX) return count[0]++;
    if (y < midY && x > midX) return count[1]++;
    if (y > midY && x < midX) return count[2]++;
    if (y > midY && x > midX) return count[3]++;
    return null;
  };

  // Find lowest security level in the first (w * h) iterations
  const store = { iteration: 0, level: Infinity };
  for (let i = 0; i < w * h; i++) {
    count.fill(0);
    data.forEach((robot) => {
      robot.x = (robot.x + robot.dx) % w;
      robot.y = (robot.y + robot.dy) % h;
      updateCount(robot.y, robot.x);
    });
    const level = count[0] * count[1] * count[2] * count[3];
    if (level >= store.level) continue;
    store.iteration = i + 1;
    store.level = level;
  }

  // Assume that if robots are drawing a pattern, they're all
  // around the same position, making security level the lowest
  return store.iteration;
};
