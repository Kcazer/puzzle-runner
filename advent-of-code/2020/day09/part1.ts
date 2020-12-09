export default ({ input }: Input) => {
  const length = 25;
  const stream = input.split("\n").map(Number);

  for (let i = length; i < stream.length; i++) {
    const value = stream[i];
    const items = stream.slice(i - length, i);
    const found = items.some((item) => items.includes(value - item));
    if (!found) return value;
  }

  throw new Error("No value found");
};
