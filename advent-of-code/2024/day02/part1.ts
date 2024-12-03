export default ({ input }: Input) => {
  const isValidDelta = (val: number) => val >= 1 && val <= 3;
  const isIncreasing = (data: number[]) => data.every((v, i) => i ? isValidDelta(data[i - 1] - v) : true);
  const isDecreasing = (data: number[]) => data.every((v, i) => i ? isValidDelta(v - data[i - 1]) : true);

  const lines = input
    .split("\n").map((line) => line.split(" ").map(Number))
    .filter((line) => isIncreasing(line) || isDecreasing(line));

  return lines.length;
};
