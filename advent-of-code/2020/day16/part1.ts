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

  // Parse tickets and remove mine from the list
  const [, ...tickets] = (input.match(/^[0-9,]+$/gm) ?? []).map((ticket) => {
    return ticket.split(",").map(Number);
  });

  // Keep only invalid values
  const invalids = tickets.flat().filter((v) => {
    return !rules.some(({ match }) => match(v));
  });

  return invalids.reduce((s, v) => s + v, 0);
};
