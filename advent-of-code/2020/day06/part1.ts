export default ({ input }: Input) => {
  return input
    .split("\n\n")
    .map((g) => new Set(g.match(/[a-z]/g) ?? []).size)
    .reduce<number>((sum, count) => sum + count, 0);
};
