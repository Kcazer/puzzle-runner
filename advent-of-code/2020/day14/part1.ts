export default ({ input }: Input) => {
  const chunks = input.split(/(?=mask = )/);
  const memory: Record<string, string> = {};

  chunks.forEach((chunk) => {
    const [mask, ...items] = chunk.trim().slice(7).split("\n");
    items.forEach((item) => {
      const [head, tail] = item.split("] = ");
      const index = parseInt(head.slice(4), 10);
      const binary = parseInt(tail, 10).toString(2).padStart(mask.length, "0");
      memory[index] = mask.replace(/X/g, (_, i) => binary[+i]);
    });
  });

  return Object.values(memory).reduce((s, v) => s + parseInt(v, 2), 0);
};
