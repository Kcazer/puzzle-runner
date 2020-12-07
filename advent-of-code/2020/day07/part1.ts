export default ({ input }: Input) => {
  // Create a mapping that list possible
  // containers for a given bag color
  const regex = /(?<=^|(\d ))\w+ \w+(?= bag)/g;
  const mapping: Record<string, string[]> = {};
  input.split("\n").forEach((rule) => {
    const [parent, ...bags] = rule.match(regex) ?? [];
    bags.forEach((bag) => (mapping[bag] ??= []).push(parent));
  });

  // Create a queue and iterate it
  let index = 0;
  const queue = mapping["shiny gold"];
  while (index < queue.length) {
    const bags = mapping[queue[index]] ?? [];
    bags.forEach((b) => !queue.includes(b) && queue.push(b));
    index += 1;
  }

  return queue.length;
};
