export default ({ input }: Input) => {
  // Parse input
  const data = input.split("\n").map((line) => {
    const parts = line.trim().split(/\D+/g).map(Number);
    const [target, ...values] = parts;
    return { target, values };
  });

  // Allowed operations
  const ops = [
    (a: number, b: number) => a + b,
    (a: number, b: number) => a * b,
  ];

  // Iterate over each entry
  const valid = data.filter(({ target, values }) => {
    // Count number of possible combinations
    const limit = ops.length ** (values.length - 1);
    for (let index = 0; index < limit; index += 1) {
      const result = index
        .toString(ops.length) // To Base N (=ops.length)
        .padStart(values.length, "0") // Fixed size (=values.length)
        .split("") // Split into individual digits to allow for ops iteration
        .reduce((acc, op, i) => ops[+op](acc, values[i]), 0); // Process left to right
      if (result === target) return true;
    }
    return false;
  });

  return valid.reduce((acc, { target }) => acc + target, 0);
};
