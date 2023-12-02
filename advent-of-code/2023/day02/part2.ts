export default ({ input }: Input) => {
  return input.trim().split("\n").map((line) => {
    const matches = [...line.matchAll(/(\d+) ([rgb])/g)];
    const groups = Object.groupBy(matches, ([, , color]) => color);
    const r = Math.max(0, ...(groups.r ?? []).map(([, count]) => +count));
    const g = Math.max(0, ...(groups.g ?? []).map(([, count]) => +count));
    const b = Math.max(0, ...(groups.b ?? []).map(([, count]) => +count));
    return r * g * b;
  }).reduce((sum, val) => sum + val, 0);
};
