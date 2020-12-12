export default ({ input }: Input) => {
  const lines = input.match(/([NSEWLRF])(\d+)/g) ?? [];
  const rules = lines.map((line) => ({ cmd: line[0], val: +line.substr(1) }));

  const boat = { x: 0, y: 0 };
  const point = { x: 10, y: 1 };
  rules.forEach(({ cmd, val }) => {
    switch (cmd) {
      case "N":
        point.y += val;
        break;
      case "S":
        point.y -= val;
        break;
      case "E":
        point.x += val;
        break;
      case "W":
        point.x -= val;
        break;
      case "L": {
        const { x, y } = point;
        const a = Math.atan2(y, x) + val * Math.PI / 180;
        const d = Math.sqrt(y * y + x * x);
        point.x = Math.cos(a) * d;
        point.y = Math.sin(a) * d;
        break;
      }
      case "R": {
        const { x, y } = point;
        const a = Math.atan2(y, x) - val * Math.PI / 180;
        const d = Math.sqrt(y * y + x * x);
        point.x = Math.cos(a) * d;
        point.y = Math.sin(a) * d;
        break;
      }
      case "F": {
        boat.x += val * point.x;
        boat.y += val * point.y;
        break;
      }
    }
  });

  const x = Math.round(Math.abs(boat.x));
  const y = Math.round(Math.abs(boat.y));

  return x + y;
};
