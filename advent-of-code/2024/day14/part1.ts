export default ({ input }: Input) => {
  // Get area size and robot details
  const [size, ...rows] = input.split("\n");
  const [w, h] = size.split(" ").map(Number);
  const data = rows.map((row) => {
    const res = [...row.match(/-?\d+/g) ?? []];
    const [x, y, dx, dy] = res.map(Number);
    return { x, y, dx, dy };
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

  // Move robots 100 times
  data.forEach((robot) => {
    robot.x = (((robot.x + robot.dx * 100) % w) + w) % w;
    robot.y = (((robot.y + robot.dy * 100) % h) + h) % h;
    updateCount(robot.y, robot.x);
  });

  // Return security level
  return count[0] * count[1] * count[2] * count[3];
};
