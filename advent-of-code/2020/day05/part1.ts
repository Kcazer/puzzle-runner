export default ({ input }: Input) => {
  const seats = input
    .replace(/[B|R]/g, "1")
    .replace(/[F|L]/g, "0")
    .split("\n")
    .map((v) => parseInt(v, 2));

  return Math.max(...seats);
};
