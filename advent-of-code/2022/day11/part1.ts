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
    return { items, getWorry, getTarget, count: 0 };
  });

  // Do 20 rounds of throwing items around
  for (let i = 0; i < 20; i++) {
    data.forEach((monkey) => {
      monkey.items.forEach((item) => {
        monkey.count += 1;
        const worry1 = monkey.getWorry(item);
        const worry2 = Math.floor(worry1 / 3);
        const target = monkey.getTarget(worry2);
        data[target].items.push(worry2);
      });
      monkey.items = [];
    });
  }

  // Find the two biggest examiners
  const [first, second] = data.sort((a, b) => b.count - a.count);
  return first.count * second.count;
};
