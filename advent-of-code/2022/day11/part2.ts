type Op = (_: number) => number;

export default ({ input }: Input) => {
  // Extract monkeys, more or less..
  const data = input.split("\n\n").map((block) => {
    const lines = block.split("\n");
    const items = lines[1].substring(17).split(",").map((v) => Number(v.trim()));
    const getWorry = new Function("old", `return ${lines[2].substring(18)};`) as Op;
    const divider = Number(lines[3].substring(20).trim());
    const iftrue = Number(lines[4].substring(28).trim());
    const iffalse = Number(lines[5].substring(29).trim());
    const getTarget = (worry: number) => (worry % divider === 0) ? iftrue : iffalse;
    return { items, divider, getWorry, getTarget, count: 0 };
  });

  // Manage stress between monkeys
  const mod = data.reduce((p, v) => p * v.divider, 1);

  // Do 10000 rounds of throwing items around
  for (let i = 0; i < 10000; i++) {
    data.forEach((monkey) => {
      monkey.items.forEach((item) => {
        monkey.count += 1;
        const worry = monkey.getWorry(item);
        const target = monkey.getTarget(worry);
        data[target].items.push(worry % mod);
      });
      monkey.items = [];
    });
  }

  // Find the two biggest examiners
  const [first, second] = data.sort((a, b) => b.count - a.count);
  return first.count * second.count;
};
