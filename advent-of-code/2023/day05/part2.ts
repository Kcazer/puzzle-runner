export default ({ input }: Input) => {
  type Range = { min: number; max: number };
  type Update = Range & { value: number };
  type Entry = { kind: string; ranges: Range[] };
  type Mapping = { src: string; dst: string; updates: Update[] };

  /** Check if two `Range` are intersecting */
  const isIntersecting = (a: Range, b: Range) => {
    return a.min < b.max && b.min < a.max;
  };

  /** Create the intersection of two `Range` */
  const getIntersectionParts = (a: Range, b: Range) => {
    // Create all possible sub-range from the two given ranges
    const dots = [a.min, a.max, b.min, b.max].sort((a, b) => a - b);
    const range1 = { min: dots[0], max: dots[1] };
    const range2 = { min: dots[1], max: dots[2] };
    const range3 = { min: dots[2], max: dots[3] };
    // Returns the ranges that are intersecting at least one of the source
    return [range1, range2, range3].filter((range) => {
      const touchingA = isIntersecting(range, a);
      const touchingB = isIntersecting(range, b);
      return touchingA || touchingB;
    });
  };

  /** Apply an `Update` to a `Range`, returns a list of `Range` */
  const applyUpdate = (range: Range, update: Update) => {
    // Get all parts from the intersection range
    const parts = getIntersectionParts(range, update);
    // Keep only parts that originate from the source range
    const ranges = parts.filter((r) => isIntersecting(r, range));
    // Update parts that are intersecting with the update range
    return ranges.map((r) => {
      if (!isIntersecting(r, update)) return { min: r.min, max: r.max };
      return { min: r.min + update.value, max: r.max + update.value, updated: true };
    });
  };

  /** Apply multiple `Update` to a `Range`, returns a list of `Range` */
  const applyUpdates = (range: Range, updates: Update[]) => {
    const ranges = [range];
    updates.forEach((update) => {
      const done = ranges.filter((r) => "updated" in r);
      const todo = ranges.filter((r) => !("updated" in r));
      const result = todo.map((r) => applyUpdate(r, update));
      ranges.splice(0, ranges.length, ...done, ...result.flat(1));
    });
    return ranges;
  };

  // Read all mappings from input
  const mappings: Mapping[] = [];
  const mappingRegex = /(\w+)-to-(\w+) map:([\d\s]+)/g;
  [...input.matchAll(mappingRegex)].forEach(([, src, dst, lines]) => {
    const updates = lines.trim().split("\n").map((line) => {
      const [d, s, l] = line.split(" ").map(Number);
      return { min: s, max: s + l, value: d - s };
    });
    mappings.push({ src, dst, updates });
  });

  // Read seeds from input
  const entries: Entry[] = [];
  const seedMatches = [...input.split("\n")[0].matchAll(/(\d+) (\d+)/g)];
  const seedRanges = seedMatches.map(([, s, l]) => ({ min: +s, max: +s + +l }));
  entries.push({ kind: "seed", ranges: seedRanges });

  // Process entries till we reach "location"
  for (const entry of entries) {
    if (entry.kind === "location") break;
    const mapping = mappings.find((m) => m.src === entry.kind);
    if (!mapping) throw new Error(`No mapping found for ${entry.kind}`);
    const ranges = entry.ranges.flatMap((r) => applyUpdates(r, mapping.updates));
    entries.push({ kind: mapping.dst, ranges: ranges.map((r) => ({ min: r.min, max: r.max })) });
  }

  // Find the smallest value in the "location" entry
  const locations = entries.find((e) => e.kind === "location");
  if (!locations) throw new Error(`Unable to find location`);
  return Math.min(...locations.ranges.map((r) => r.min));
};
