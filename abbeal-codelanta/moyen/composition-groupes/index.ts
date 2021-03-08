export default ({ input }: Input) => {
  // Parse input
  const data = input.trim().split("\n").map((v) => v.split(","));

  // Map a name to its group, and create getter
  const store = new Map<string, Set<string>>();
  const get = (n: string) => [...(store.get(n) ?? [n])];

  // Iterate while merging
  data.forEach((names) => {
    const group = new Set(names.flatMap(get));
    group.forEach((name) => store.set(name, group));
  });

  // Extract all groups and count them
  const groups = new Set([...store.values()]);
  return groups.size;
};
