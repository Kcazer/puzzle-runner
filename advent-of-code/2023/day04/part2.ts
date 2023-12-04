export default ({ input }: Input) => {
  const data = input.trim().split("\n").map((line) => {
    const [, win, num] = line.split(/ *[:|] */).map((v) => v.split(/ +/).map(Number));
    const shared = win.length + num.length - new Set([...win, ...num]).size;
    return { shared, count: 1 };
  });

  data.forEach(({ shared, count }, index) => {
    for (let i = 1; i <= shared; i++) data[index + i].count += count;
  });

  return data.reduce((sum, item) => sum + item.count, 0);
};
