export default ({ input }: Input) => {
  const width = input.indexOf("\n") + 1;

  const numbers = [...input.matchAll(/\d+/g)].map(({ 0: match, index = 0 }) => {
    return { v: +match, x: index % width, y: Math.floor(index / width), w: match.length };
  });

  const symbols = [...input.matchAll(/\*+/g)].map(({ index = 0 }) => {
    return { x: index % width, y: Math.floor(index / width) };
  });

  const gears = symbols.map((symbol) => {
    const adj = numbers.filter((number) => {
      if (symbol.y < number.y - 1) return false;
      if (symbol.y > number.y + 1) return false;
      if (symbol.x < number.x - 1) return false;
      if (symbol.x > number.x + number.w) return false;
      return true;
    });
    if (adj.length !== 2) return null;
    const power = adj[0].v * adj[1].v;
    return { ...symbol, power };
  });

  return gears.reduce((sum, gear) => sum + (gear?.power ?? 0), 0);
};
