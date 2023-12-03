export default ({ input }: Input) => {
  const width = input.indexOf("\n") + 1;

  const numbers = [...input.matchAll(/\d+/g)].map(({ 0: match, index = 0 }) => {
    return { v: +match, x: index % width, y: Math.floor(index / width), w: match.length };
  });

  const symbols = [...input.matchAll(/[^\d\n\.]+/g)].map(({ index = 0 }) => {
    return { x: index % width, y: Math.floor(index / width) };
  });

  const parts = numbers.filter((number) =>
    symbols.some((symbol) => {
      if (symbol.y < number.y - 1) return false;
      if (symbol.y > number.y + 1) return false;
      if (symbol.x < number.x - 1) return false;
      if (symbol.x > number.x + number.w) return false;
      return true;
    })
  );

  return parts.reduce((sum, item) => sum + item.v, 0);
};
