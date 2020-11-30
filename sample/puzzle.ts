export default ({ inputA, inputB }: Input) => {
  const sumA = inputA.split("\n").reduce((s, v) => s + +v, 0);
  const sumB = inputB.split("\n").reduce((s, v) => s + +v, 0);
  return sumA * sumB;
};
