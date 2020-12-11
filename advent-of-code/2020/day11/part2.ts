export default ({ input }: Input) => {
  const seats = input.split("\n").map((row) => row.split(""));

  // Map each seat to the list of seats it can see
  const targets: [number, number][][][] = [];
  for (let y = 0; y < seats.length; y++) {
    targets.push([]);
    for (let x = 0; x < seats[y].length; x++) {
      targets[y].push([]);
      const out: [number, number][] = [];
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dy === 0 && dx === 0) continue;
          let [yy, xx] = [y, x];
          while (true) {
            [yy, xx] = [yy + dy, xx + dx];
            const seat = seats[yy]?.[xx];
            if (seat == null) break;
            if (seat !== ".") {
              targets[y][x].push([yy, xx]);
              break;
            }
          }
        }
      }
    }
  }

  const update = (initial: string[][]) => {
    return initial.map((row, i) => {
      return row.map((seat, j) => {
        const around = targets[i][j].map(([y, x]) => initial[y]?.[x]);
        if (seat === "#" && around.filter((v) => v === "#").length > 4) {
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
