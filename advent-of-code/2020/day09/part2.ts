export default ({ input }: Input) => {
  const lookup = 21806024;
  const stream = input.split("\n").map(Number);

  for (let i = 0; i < stream.length; i++) {
    let value = stream[i];
    for (let j = i + 1; j < stream.length; j++) {
      value += stream[j];
      if (value === lookup) {
        const slice = stream.slice(i, j + 1);
        const min = Math.min(...slice);
        const max = Math.max(...slice);
        return min + max;
      }
    }
  }

  throw new Error("No value found");
};
