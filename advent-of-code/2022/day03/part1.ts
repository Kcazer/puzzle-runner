export default ({ input }: Input) => {
  // Create list of bags
  const data = input.split("\n")
    .map((line) => [
      line.substring(0, line.length / 2),
      line.substring(line.length / 2),
    ]);

  // Find shared items between pockets
  const shared = data.map(([sideA, sideB]) => {
    const setA = new Set([...sideA]);
    const setB = new Set([...sideB]);
    return [...setA].filter((v) => setB.has(v));
  });

  // Flatten result and compute priorities
  const priorities = shared.flat().map((item) => {
    const code = item.charCodeAt(0);
    return code - (code > 96 ? 96 : 38);
  });

  // Compute sum
  return priorities.reduce((s, v) => s + v, 0);
};
