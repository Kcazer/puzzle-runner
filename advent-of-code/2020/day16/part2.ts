export default ({ input }: Input) => {
  // Parse rules
  const rules = (input.match(/^[a-z ]+:[or 0-9-]+$/gm) ?? []).map((rule) => {
    const [name, ranges] = rule.split(": ");
    const filters = ranges.split(" or ").map((range) => {
      const [min, max] = range.split("-").map(Number);
      return (v: number) => v >= min && v <= max;
    });
    const match = (v: number) => filters.some((fn) => fn(v));
    return { name, match };
  });

  // Extract my ticket and all the other valid tickets
  const [mine, ...tickets] = (input.match(/^[0-9,]+$/gm) ?? [])
    .map((t) => (t.match(/\d+/g) ?? []).map((v) => parseInt(v, 10)))
    .filter((t) => t.every((v) => rules.some(({ match }) => match(v))));

  // Build a list of possible rules per positions
  const possibilities = Array.from({ length: rules.length }, (_, i) => {
    const values = tickets.map((t) => t[i]);
    const options = rules.filter(({ match }) => values.every(match));
    return options.map(({ name }) => name);
  });

  // Extract the positions from the list of possibilities
  const positions = new Map<string, number>();
  while (positions.size !== rules.length) {
    possibilities.forEach((options, pos) => {
      if (options.length !== 1) return;
      positions.set(options[0], pos);
      const filter = (v: string) => v !== options[0];
      possibilities.forEach((n, i, s) => (s[i] = n.filter(filter)));
      // console.log("Position", `${pos}`.padStart(2, "0"), ":", options[0]);
    });
  }

  // Find values for my ticket
  const values = [...positions].map(([name, pos]) => {
    const value = mine[pos];
    return { name, value };
  });

  // And then sum the departure fields
  const result = values.reduce((p, { name, value }) => {
    return p * (name.startsWith("departure ") ? value : 1);
  }, 1);

  return result;
};
