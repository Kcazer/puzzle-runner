export default ({ input }: Input) => {
  const lines = input.split("\n");
  const regex = /^(\d+)-(\d+) (\w): (.*)$/;
  const valids = lines.filter((line) => {
    const parsed = line.match(regex) ?? [];
    const [, min, max, char, password] = parsed;
    const count = password.split(char).length - 1;
    return count >= +min && count <= +max;
  });
  return valids.length;
};
