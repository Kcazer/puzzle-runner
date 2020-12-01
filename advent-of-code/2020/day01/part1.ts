export default ({ input }: Input) => {
  const lines = input.split("\n").map(Number);
  for (let i = 0; i < lines.length; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      if (lines[i] + lines[j] === 2020) {
        return lines[i] * lines[j];
      }
    }
  }
};
