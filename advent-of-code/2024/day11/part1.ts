export default ({ input }: Input) => {
  // Parse input as a list of BigInt (just in case...)
  const data = [...input.match(/\d+/g) ?? []].map(BigInt);

  // This will map a value to an array of children so that
  // we only have to do the transformation once per number
  const children = new Map<bigint, bigint[]>();

  // Number of iterations
  const limit = 25;

  // Iterate to get all possible children
  const values = [...data];
  for (let i = 0; i < limit; i++) {
    // Copy array and empty original
    const temp = values.concat();
    values.splice(0, Infinity);
    // Iterate to refill values
    temp.forEach((value) => {
      // Skip if already known
      if (children.get(value)) return;
      // 0 -> 1
      if (value === 0n) {
        const zerotoone = [1n];
        children.set(value, zerotoone);
        values.push(...zerotoone);
        return;
      }
      // Even number of digits -> split
      const string = value.toString();
      const length = string.length;
      if (length % 2 === 0) {
        const part1 = BigInt(string.substring(0, length / 2));
        const part2 = BigInt(string.substring(length / 2));
        const split = [BigInt(part1), BigInt(part2)];
        children.set(value, split);
        values.push(...split);
        return;
      }
      // Else -> value * 2024
      const mul2024 = [value * 2024n];
      children.set(value, mul2024);
      values.push(...mul2024);
    });
  }

  // Setup a root at -1 = data
  children.set(-1n, data);

  // Recursively count children
  const countChild = (value = -1n, depth = limit): number => {
    // Directly return count at max depth
    const items = children.get(value)!;
    if (depth === 0) return items.length;
    // Apply recursion, then return the result
    return items
      .map((v) => countChild(v, depth - 1))
      .reduce((sum, count) => sum + count, 0);
  };

  return countChild();
};
