export default ({ input }: Input) => {
  //
  const Kind = { NS: "|", WE: "-", NE: "L", NW: "J", SW: "7", SE: "F", DOT: "S", VOID: "." };
  const Nice = { NS: "│", WE: "─", NE: "╰", NW: "╯", SW: "╮", SE: "╭", DOT: "○", VOID: " " };
  const Link = {
    [Kind.NS]: [Kind.NS, Kind.SW, Kind.SE, Kind.NW, Kind.NE],
    [Kind.WE]: [Kind.WE, Kind.NE, Kind.SE, Kind.NW, Kind.SW],
    [Kind.NE]: [Kind.SW, Kind.NS, Kind.SE, Kind.NW, Kind.SW],
    [Kind.NW]: [Kind.SE, Kind.NS, Kind.SW, Kind.WE, Kind.NE],
    [Kind.SW]: [Kind.NE, Kind.NS, Kind.NW, Kind.WE, Kind.SE],
    [Kind.SE]: [Kind.NS, Kind.NE, Kind.NW, Kind.WE, Kind.SW],
  };
  const Move = {
    N: { x: 0, y: -1 },
    S: { x: 0, y: 1 },
    E: { x: 1, y: 0 },
    W: { x: -1, dy: 0 },
  };
  const Path = {
    [Kind.NS]: [Move.N, Move.S],
    [Kind.WE]: [Move.W, Move.E],
    [Kind.NE]: [Move.N, Move.E],
    [Kind.NW]: [Move.N, Move.W],
    [Kind.SW]: [Move.S, Move.W],
    [Kind.SE]: [Move.S, Move.E],
  };

  const Display = {
    [Kind.NS]: "│",
    [Kind.WE]: "─",
    [Kind.NE]: "╰",
    [Kind.NW]: "╯",
    [Kind.SW]: "╮",
    [Kind.SE]: "╭",
    [Kind.DOT]: "○",
    [Kind.VOID]: " ",
  };

  // Prettify the map
  const grid = input
    .replaceAll("|", Kind.NS)
    .replaceAll("-", Kind.WE)
    .replaceAll("L", Kind.NE)
    .replaceAll("J", Kind.NW)
    .replaceAll("7", Kind.SW)
    .replaceAll("F", Kind.SE)
    .replaceAll("S", Kind.DOT)
    .replaceAll(".", Kind.VOID);

  // List all nodes
  type Node = { x: number; y: number; kind: string; nodes: Set<Node> };
  const nodes = new Map<string, Node>();
  grid.split("\n").forEach((row, y) =>
    row.split("").map((kind, x) => {
      nodes.set(`${x},${y}`, { x, y, kind, nodes: new Set() });
    })
  );

  const cleanup = () => {
    for (let x = 0; x < data.length; x++) {
      for (let y = 0; y < data[x].length; y++) {
        // Get cells around
        const c = data[y][x];
        const l = data[y]?.[x - 1];
        const r = data[y]?.[x + 1];
        const u = data[y - 1]?.[x];
        const d = data[y + 1]?.[x];
        // Check left
        if (c === NS) {
          if (u !== SW && u !== NS && u !== SE && u !== DOT) data[y][x] = " ";
          if (d !== NW && d !== NS && d !== NE && d !== DOT) data[y][x] = " ";
        } else if (c === WE) {
          if (l !== NE && l !== WE && l !== SE && l !== DOT) data[y][x] = " ";
          if (r !== NW && r !== WE && r !== SW && r !== DOT) data[y][x] = " ";
        } else if (c === NE) {
          if (u !== SW && u !== NS && u !== SE && u !== DOT) data[y][x] = " ";
          if (r !== NW && r !== WE && r !== SW && r !== DOT) data[y][x] = " ";
        } else if (c === NW) {
          if (u !== SW && u !== NS && u !== SE && u !== DOT) data[y][x] = " ";
          if (l !== NE && l !== WE && l !== SE && l !== DOT) data[y][x] = " ";
        } else if (c === SW) {
          if (d !== NW && d !== NS && d !== NE && d !== DOT) data[y][x] = " ";
          if (l !== NE && l !== WE && l !== SE && l !== DOT) data[y][x] = " ";
        } else if (c === SE) {
          if (d !== NW && d !== NS && d !== NE && d !== DOT) data[y][x] = " ";
          if (r !== NW && r !== WE && r !== SW && r !== DOT) data[y][x] = " ";
        }
      }
    }
  };

  console.log(data.map((l) => l.join("")).join("\n"));
  cleanup();
  cleanup();
  cleanup();
  cleanup();
  cleanup();
  console.log(data.map((l) => l.join("")).join("\n"));
};
