export default ({ input }: Input) => {
  const [t, d] = input.trim().split("\n").map((line) => {
    return Number(line.replaceAll(/[^\d]+/g, ""));
  });

  const x1 = (t + Math.sqrt(t ** 2 - 4 * d)) / 2;
  const x2 = (t - Math.sqrt(t ** 2 - 4 * d)) / 2;
  const min = Math.floor(Math.min(x1, x2) + 1);
  const max = Math.ceil(Math.max(x1, x2) - 1);
  const val = max - min + 1;

  return val;
};
