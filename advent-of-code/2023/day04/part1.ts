export default ({ input }: Input) => {
  return input.trim().split("\n").map((line) => {
    const [, win, num] = line.split(/ *[:|] */).map((v) => v.split(/ +/).map(Number));
    const shared = win.length + num.length - new Set([...win, ...num]).size;
    return shared ? 2 ** (shared - 1) : 0;
  }).reduce((sum, val) => sum + val, 0);
};
