export default ({ input }: Input) => {
  const data = input.split("\n").map((line) => {
    return line.split(",").map((item) => {
      return item.split("-").map(Number);
    });
  });

  const fulloverlaps = data.filter(([[startA, endA], [startB, endB]]) => {
    if (startA <= startB && endA >= endB) return true; // A contains B
    if (startA >= startB && endA <= endB) return true; // B contains A
    return false;
  });

  return fulloverlaps.length;
};
