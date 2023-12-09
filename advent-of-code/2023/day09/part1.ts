export default ({ input }: Input) => {
  const getDiff = (list: number[]): number[] => {
    return list.slice(1).map((v, i) => v - list[i]);
  };

  const getNext = (list: number[]): number => {
    if (list.every((v) => v === 0)) return 0;
    const next = getNext(getDiff(list));
    return next + list[list.length - 1];
  };

  const values = input.split("\n").map((line) => line.split(" ").map(Number));

  return values.map(getNext).reduce((sum, val) => sum + val, 0);
};
