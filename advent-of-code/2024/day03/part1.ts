export default ({ input }: Input) => {
  const muls = [...input.matchAll(/mul\((\d+),(\d+)\)/g)];
  return muls.reduce((s, [, a, b]) => s + (+a * +b), 0);
};
