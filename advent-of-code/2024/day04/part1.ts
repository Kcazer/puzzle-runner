export default ({ input }: Input) => {
  const width = input.indexOf("\n");
  const regexes = [
    "XMAS",
    "SAMX",
    "XMAS".split("").join(".".repeat(width)),
    "SAMX".split("").join(".".repeat(width)),
    "XMAS".split("").join(".".repeat(width - 1)),
    "SAMX".split("").join(".".repeat(width - 1)),
    "XMAS".split("").join(".".repeat(width + 1)),
    "SAMX".split("").join(".".repeat(width + 1)),
  ];
  const count = regexes.map((r) => {
    const regex = new RegExp(`(?<=${r})`, "gs");
    const matches = input.match(regex);
    return matches?.length ?? 0;
  });
  return count.reduce((s, v) => s + v, 0);
};
