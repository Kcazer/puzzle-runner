export default ({ input }: Input) => {
  const seats = input.split("\n").map((row) => row.split(""));

  const update = (initial: string[][]) => {
    return initial.map((row, i) => {
      return row.map((seat, j) => {
        const around = [
          initial[i - 1]?.[j - 1],
          initial[i - 1]?.[j],
          initial[i - 1]?.[j + 1],
          initial[i]?.[j - 1],
          initial[i]?.[j + 1],
          initial[i + 1]?.[j - 1],
          initial[i + 1]?.[j],
          initial[i + 1]?.[j + 1],
        ];
        if (seat === "#" && around.filter((v) => v === "#").length > 3) {
          return "L";
        }
        if (seat === "L" && around.every((v) => v !== "#")) return "#";
        return seat;
      });
    });
  };

  const isSame = (a: string[][], b: string[][]) => {
    const aa = a.map((v) => v.join("")).join("\n");
    const bb = b.map((v) => v.join("")).join("\n");
    return aa === bb;
  };

  let prev: string[][] = [];
  let curr: string[][] = seats;
  while (!isSame(prev, curr)) [curr, prev] = [update(curr), curr];

  const final = curr.map((v) => v.join("")).join("\n");
  return final.split("#").length - 1;
};
