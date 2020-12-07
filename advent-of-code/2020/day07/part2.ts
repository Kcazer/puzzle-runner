export default ({ input }: Input) => {
  // Create a mapping that list children
  // (color+count) of a every given bag
  const regex = /(^|(\d ))\w+ \w+(?= bag)/g;
  const mapping: Record<string, [string, number][]> = {};
  input.split("\n").forEach((rule) => {
    const [parent, ...bags] = rule.match(regex) ?? [];
    mapping[parent] = bags.map((bag) => {
      const matches = bag.match(/^(\d+) (.*)$/);
      const [, count, name] = matches ?? [];
      return [name, +count];
    });
  });

  // Create a queue and iterate it
  let index = 0;
  const queue = mapping["shiny gold"];
  while (index < queue.length) {
    const [bag, count] = queue[index];
    (mapping[bag] ?? []).forEach((item) => {
      queue.push([item[0], item[1] * count]);
    });
    index += 1;
  }

  return queue.reduce<number>((s, [, c]) => s + c, 0);
};
