export default ({ input }: Input) => {
  const lines = input.split("\n");
  const regex = /^(\d+)-(\d+) (\w): (.*)$/;
  const valids = lines.filter((line) => {
    const parsed = line.match(regex) ?? [];
    const [, pos1, pos2, char, password] = parsed;
    const validPos1 = password[+pos1 - 1] === char;
    const validPos2 = password[+pos2 - 1] === char;
    return !!(+validPos1 ^ +validPos2);
  });
  return valids.length;
};
