export default ({ input }: Input) => {
  const sideA: number[] = [];
  const sideB: number[] = [];

  const matches = [...input.matchAll(/(\d+) +(\d+)/g)];
  matches.forEach(([_, valA, valB]) => {
    sideA.push(+valA);
    sideB.push(+valB);
  });

  sideA.sort((x, y) => x - y);
  sideB.sort((x, y) => x - y);

  const length = Math.min(sideA.length, sideB.length);
  return Array
    .from({ length }, (_, i) => [sideA[i], sideB[i]] as const)
    .reduce((acc, [a, b]) => acc + Math.abs(a - b), 0);
};
