export default ({ input }: Input) => {
  // Get seeds as a list of numbers
  const seeds = input.split("\n")[0].split(" ").slice(1).map(Number);

  // Build a mapping function for each kind of conversion
  const maps = new Map<string, (v: number) => [string, number]>();
  [...input.matchAll(/(\w+)-to-(\w+) map:([\d\s]+)/g)].forEach((match) => {
    const [, src, dst, lines] = match;
    const ranges = lines.trim().split("\n").map((line) => {
      const [d, s, l] = line.split(" ").map(Number);
      return { min: s, max: s + l, dt: d - s };
    });
    maps.set(src, (v) => {
      const map = ranges.find((r) => v >= r.min && v <= r.max);
      return [dst, map ? v + map.dt : v];
    });
  });

  // Iterate each seed, apply mappings, keep smallest location
  let location = Infinity;
  seeds.forEach((seed) => {
    let [kind, value] = ["seed", seed];
    while (kind !== "location") {
      const next = maps.get(kind)?.(value);
      if (next == null) break;
      [kind, value] = next;
    }
    if (value < location) location = value;
  });

  return location;
};
