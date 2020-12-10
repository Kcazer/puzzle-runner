export default ({ input }: Input) => {
  const source = input.split("\n").map(Number);

  const count: number[] = [0, 0, 0, 0];
  source.sort((a, b) => a - b).forEach((v, i, a) => {
    const diff = v - (a[i - 1] ?? 0);
    count[diff] = (count[diff] ?? 0) + 1;
  });

  return count[1] * (count[3] + 1);
};
