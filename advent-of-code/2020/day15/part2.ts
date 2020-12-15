export default ({ input }: Input) => {
  const size = 30000000;
  const data = input.split(",").map(Number);

  const indexes = new Uint32Array(size).fill(0);
  data.slice(0, -1).forEach((v, i) => indexes[v] = i + 1);

  let value = data[data.length - 1];
  for (let i = data.length; i < size; i++) {
    const latest = indexes[value];
    indexes[value] = i;
    value = latest ? i - latest : 0;
  }

  return value;
};
