export default ({ input }: Input) => {
  const getDiff = (list: number[]): number[] => {
    return list.slice(1).map((v, i) => v - list[i]);
  };

  const getPrev = (list: number[]): number => {
    if (list.every((v) => v === 0)) return 0;
    const prev = getPrev(getDiff(list));
    return list[0] - prev;
  };

  const values = input.split("\n").map((line) => line.split(" ").map(Number));

  return values.map(getPrev).reduce((sum, val) => sum + val, 0);
};
