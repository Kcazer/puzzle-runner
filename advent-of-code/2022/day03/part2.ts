export default ({ input }: Input) => {
  // Create list of groups
  const data = input.split("\n")
    .map((_, i, arr) => [arr[i], arr[i + 1], arr[i + 2]])
    .filter((_, i) => (i % 3) === 0);

  // Find shared items in each list
  const shared = data.map(([bagA, bagB, bagC]) => {
    const setA = new Set([...bagA]);
    const setB = new Set([...bagB]);
    const setC = new Set([...bagC]);
    return [...setA].filter((v) => setB.has(v) && setC.has(v));
  });

  // Flatten result and compute priorities
  const priorities = shared.flat().map((item) => {
    const code = item.charCodeAt(0);
    return code - (code > 96 ? 96 : 38);
  });

  // Compute sum
  return priorities.reduce((s, v) => s + v, 0);
};
