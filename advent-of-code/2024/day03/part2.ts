export default ({ input }: Input) => {
  const clean = input.replaceAll(/don't\(\).*?do\(\)/gs, "");
  const muls = [...clean.matchAll(/mul\((\d+),(\d+)\)/g)];
  return muls.reduce((s, [, a, b]) => s + (+a * +b), 0);
};
