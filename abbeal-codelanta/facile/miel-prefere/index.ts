export default ({ input }: Input) => {
  const lines = input.trim().split("\n").map((v) => v.trim());
  const count: Record<string, number> = {};

  lines.forEach((line) => void (count[line] = (count[line] ?? 0) + 1));
  const sorted = Object.entries(count).sort(([, a], [, b]) => b - a);

  return sorted[0][0];
};
