export default ({ input }: Input) => {
  const limit = { r: 12, g: 13, b: 14 };
  return input.trim().split("\n").map((line) => {
    const matches = [...line.matchAll(/(\d+) ([rgb])/g)];
    const groups = Object.groupBy(matches, ([, , color]) => color);
    const isValidR = groups.r.every(([, count]) => +count <= limit.r);
    const isValidG = groups.g.every(([, count]) => +count <= limit.g);
    const isValidB = groups.b.every(([, count]) => +count <= limit.b);
    // isValid = matches.every(([, count, color]) => +count <= limit[color]);
    return isValidR && isValidG && isValidB ? parseInt(line.slice(5), 10) : 0;
  }).reduce((sum, val) => sum + val, 0);
};
