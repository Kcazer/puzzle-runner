export default ({ input }: Input) => {
  const isValidDelta = (val: number) => val >= 1 && val <= 3;
  const isIncreasing = (data: number[]) => data.every((v, i) => i ? isValidDelta(data[i - 1] - v) : true);
  const isDecreasing = (data: number[]) => data.every((v, i) => i ? isValidDelta(v - data[i - 1]) : true);

  const isAlmostIncreasing = (data: number[]) =>
    Array
      .from({ length: data.length }, (_, i) => i)
      .some((i) => isIncreasing(data.toSpliced(i, 1)));
  const isAlmostDecreasing = (data: number[]) =>
    Array
      .from({ length: data.length }, (_, i) => i)
      .some((i) => isDecreasing(data.toSpliced(i, 1)));

  const lines = input
    .split("\n").map((line) => line.split(" ").map(Number))
    .filter((line) => isAlmostIncreasing(line) || isAlmostDecreasing(line));

  return lines.length;
};
