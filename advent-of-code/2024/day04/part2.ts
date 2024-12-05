export default ({ input }: Input) => {
  const width = input.indexOf("\n");
  const regexes = [
    ["M.M", ".A.", "S.S"].join(".".repeat(width - 2)),
    ["M.S", ".A.", "M.S"].join(".".repeat(width - 2)),
    ["S.S", ".A.", "M.M"].join(".".repeat(width - 2)),
    ["S.M", ".A.", "S.M"].join(".".repeat(width - 2)),
  ];
  const count = regexes.map((r) => {
    const regex = new RegExp(`(?<=${r})`, "gs");
    const matches = input.match(regex);
    return matches?.length ?? 0;
  });
  return count.reduce((s, v) => s + v, 0);
};
