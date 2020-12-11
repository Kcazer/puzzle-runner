export default ({ input }: Input) => {
  const reducer = (combs: number[], polen: number) => {
    if (combs[0] + polen > 100) combs.unshift(polen);
    else combs[0] += polen;
    return combs;
  };

  return input
    .split("\n")
    .slice(1)
    .map((v) => +v)
    .reduce(reducer, [0]).length;
};
