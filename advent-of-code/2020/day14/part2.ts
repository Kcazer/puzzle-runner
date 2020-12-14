export default ({ input }: Input) => {
  const chunks = input.split(/(?=mask = )/);
  const memory: Record<string, number> = {};

  const parse = (pattern: string, list: number[] = []) => {
    if (pattern.includes("X")) {
      parse(pattern.replace("X", "0"), list);
      parse(pattern.replace("X", "1"), list);
    } else list.push(parseInt(pattern, 2));
    return list;
  };

  chunks.forEach((chunk) => {
    const [mask, ...items] = chunk.trim().slice(7).split("\n");
    items.forEach((item) => {
      const [head, tail] = item.split("] = ");
      const value = parseInt(tail, 10);
      const index = parseInt(head.slice(4), 10);
      const binary = index.toString(2).padStart(36, "0");
      const pattern = mask.replace(/0/g, (_, i) => binary[+i]);
      parse(pattern).forEach((pointer) => void (memory[pointer] = value));
    });
  });

  return Object.values(memory).reduce((s, v) => s + v, 0);
};
