export default ({ input }: Input) => {
  const data = input.split("\n").map((line) => {
    return line.split(",").map((item) => {
      return item.split("-").map(Number);
    });
  });

  const overlaps = data.filter(([[startA, endA], [startB, endB]]) => {
    return startA <= endB && endA >= startB;
  });

  return overlaps.length;
};
