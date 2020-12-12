export default ({ input }: Input) => {
  const lines = input.match(/([NSEWLRF])(\d+)/g) ?? [];
  const rules = lines.map((line) => ({ cmd: line[0], val: +line.substr(1) }));

  const boat = { x: 0, y: 0, a: 0 };
  rules.forEach(({ cmd, val }) => {
    switch (cmd) {
      case "N":
        boat.y += val;
        break;
      case "S":
        boat.y -= val;
        break;
      case "E":
        boat.x += val;
        break;
      case "W":
        boat.x -= val;
        break;
      case "L":
        boat.a += val;
        break;
      case "R":
        boat.a -= val;
        break;
      case "F":
        boat.x += Math.cos(boat.a * Math.PI / 180) * val;
        boat.y += Math.sin(boat.a * Math.PI / 180) * val;
        break;
    }
  });

  const x = Math.round(Math.abs(boat.x));
  const y = Math.round(Math.abs(boat.y));

  return x + y;
};
