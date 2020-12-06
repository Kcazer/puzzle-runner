export default ({ input }: Input) => {
  return input
    .split("\n\n")
    .map((group) => {
      const rows = group.split("\n").length;
      const items = group.match(/[a-z]/g) ?? [];
      const counter: Record<string, number> = {};
      items.forEach((a) => (counter[a] = (counter[a] ?? 0) + 1));
      return Object.values(counter).filter((v) => v === rows).length;
    })
    .reduce<number>((sum, count) => sum + count, 0);
};
