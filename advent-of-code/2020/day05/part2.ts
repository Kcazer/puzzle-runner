export default ({ input }: Input) => {
  const seats = input
    .replace(/[B|R]/g, "1")
    .replace(/[F|L]/g, "0")
    .split("\n")
    .map((v) => parseInt(v, 2))
    .sort((a, b) => a - b);

  for (let i = 1; i < seats.length; i++) {
    const [a, b] = [seats[i - 1], seats[i]];
    if (b - a > 1) return (a + b) / 2;
  }

  throw new Error("Unable to find seat");
};
