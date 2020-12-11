export default ({ input }: Input) => {
  return input.split("\n").filter((v) => +v >= 10).length;
};
