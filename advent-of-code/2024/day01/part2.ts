export default ({ input }: Input) => {
  const sideA: number[] = [];
  const sideB: number[] = [];

  const matches = [...input.matchAll(/(\d+) +(\d+)/g)];
  matches.forEach(([_, valA, valB]) => {
    sideA.push(+valA);
    sideB.push(+valB);
  });

  const counter: Record<string, { value: number; countA: number; countB: number }> = {};
  [...input.matchAll(/(\d+) +(\d+)/g)].forEach(([_, valA, valB]) => {
    counter[valA] ??= { value: +valA, countA: 0, countB: 0 };
    counter[valB] ??= { value: +valB, countA: 0, countB: 0 };
    counter[valA].countA++;
    counter[valB].countB++;
  });

  return Object.values(counter).reduce((acc, item) => {
    const boost = item.countA * item.countB;
    return acc + item.value * boost;
  }, 0);
};
