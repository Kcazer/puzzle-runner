export default ({ input }: Input) => {
  const source = input.split("\n").map(Number);

  const store: Record<string, number> = { 0: 1 };
  [0, ...source].sort((a, b) => a - b).forEach((value) => {
    if (source.includes(value + 1)) {
      store[value + 1] = (store[value + 1] ?? 0) + store[value];
    }
    if (source.includes(value + 2)) {
      store[value + 2] = (store[value + 2] ?? 0) + store[value];
    }
    if (source.includes(value + 3)) {
      store[value + 3] = (store[value + 3] ?? 0) + store[value];
    }
  });

  return Math.max(...Object.values(store));
};
