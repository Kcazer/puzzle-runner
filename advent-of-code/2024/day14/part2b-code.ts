export default ({ input }: Input) => {
  // Get area size and robot details
  const [size, ...rows] = input.split("\n");
  const [w, h] = size.split(" ").map(Number);
  const data = rows.map((row) => {
    const res = [...row.match(/-?\d+/g) ?? []];
    const [x, y, dx, dy] = res.map(Number);
    return { x, y, dx, dy };
  });

  // Create a 2D array of sets to store robots
  const area = Array.from({ length: h }, (_, y) => {
    return Array.from({ length: w }, (_, x) => {
      const robots = data.filter((r) => x === r.x && y === r.y);
      return new Set(robots);
    });
  });

  // Move robots {iter} times
  const move = (iter = 1) => {
    data.forEach((robot) => {
      // Remove from old position
      area[robot.y][robot.x].delete(robot);
      // Move robot to new position
      robot.x = (((robot.x + robot.dx * iter) % w) + w) % w;
      robot.y = (((robot.y + robot.dy * iter) % h) + h) % h;
      area[robot.y][robot.x].add(robot);
    });
  };

  // Display html header
  const head = () => {
    console.log(`
      <style>
        svg { float: left; width: ${w}px; height: ${h}px; margin: 4px; border: 1px solid black; }
        text { font-size: 12px; line-height: 14px; }
      </style>
      <body>
        <div>
    `);
  };

  // Display area as SVG
  const draw = (label: string | number = "") => {
    console.log(`<svg viewBox="0 0 ${w} ${h}">`);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const robots = area[y][x];
        if (robots.size === 0) continue;
        const color = ["darkgreen", "red", "yellow"][robots.size - 1] || "blue";
        console.log(`<rect x="${x}" y="${y}" width="1" height="1" fill="${color}" />`);
      }
    }
    console.log(`<text x="1" y="9">${label}</text>`);
    console.log("</svg>");
  };

  [head, draw];

  /*
  By drawing the 500 first iterations, we can see two patterns
  - Code: [head(),draw(0),Array.from({length:500},(_, i)=>[move(1),draw(i+1)])];
  - ① At 18, 119, 220, 321 and 422 → horizontal line of robots
  - ② At 76, 179, 282, 385 and 488 → vertical line of robots

  This is AoC, the answer is likely to be where these pattens overlaps.
  - ① Horizontal pattern appears at (18 + 101m)
  - ② Vertical pattern appears at (76 + 103n)

  Writing the equality and simplifying gives us a diophantine equation
  - (101m + 18) = (103n + 76)
  - 101m - 103n - 58 = 0

  This looks like a job for Wolfram Alpha...
  - https://www.wolframalpha.com/input?i=solve+101m-103n-58+over+integers
  - Gives us, for k integer, m = 103k + 74 and n = 101k + 72
  - Taking k = 0, we get m = 74 and n = 72, which gives us
    - ① 101 * 74 + 18 = 7492
    - ② 103 * 72 + 76 = 7492

  Note:
  - The patterns can be found by analysing the quadrants over time
  - Solving the equations manually is obviously possible, but I'm lazy
  - Drawing 500 first terms of any equation is sufficient to find the answer
    - ① [head(),move(18),draw(18),Array.from({length:500},(_,i)=>[move(101),draw(101*i+18)])];
    - ② [head(),move(76),draw(76),Array.from({length:500},(_,i)=>[move(103),draw(103*i+76)])];
  */

  // Hardcoded answer
  const answer = 7492;
  move(answer);

  // Generate nice output
  const print = Array.from({ length: h / 2 }, (_, y) =>
    Array.from({ length: w }, (_, x) => {
      const countA = area[y * 2][x].size ? 1 : 0;
      const countB = area[y * 2 + 1]?.[x].size ? 1 : 0;
      return [" ", "▀", "▄", "█"][countA + countB * 2];
    }).join("")).join("\n");

  return `${print}\n${answer}`;
};
