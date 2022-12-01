export default ({ input }: Input) => {
  const data = input.split("\n\n").map((lines) => {
    const food = lines.split("\n").map(Number);
    const energy = food.reduce((a, b) => a + b, 0);
    return { food, energy };
  });

  const sorted = [...data].sort((a, b) => b.energy - a.energy);
  return sorted.at(0)?.energy;
};
