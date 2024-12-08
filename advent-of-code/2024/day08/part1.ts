export default ({ input }: Input) => {
  // Internal typings for data structure
  type Data = Record<string, {
    type: string;
    nodes: { x: number; y: number }[];
    antis: { x: number; y: number }[];
  }>;

  // Dimensions of the area
  const width = input.indexOf("\n");
  const height = input.split("\n").length;

  // Nodes and their positions
  const items = [...input.matchAll(/\w/g)].map((match) => {
    const y = ~~(match.index / (width + 1));
    const x = match.index % (width + 1);
    return { type: match[0], x, y };
  });

  // Group them per types and prepare data structure
  const data: Data = {};
  items.forEach(({ type, x, y }) => {
    data[type] ??= { type, nodes: [], antis: [] };
    data[type].nodes.push({ x, y });
  });

  // Iterate each type to compute antinodes
  for (const type in data) {
    const entry = data[type];
    const { nodes, antis } = entry;
    // Compute antinode for each pair of node
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        // Compute delta between the nodes
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        // Push potential antinodes to the list
        antis.push({ x: nodes[i].x + dx, y: nodes[i].y + dy });
        antis.push({ x: nodes[j].x - dx, y: nodes[j].y - dy });
      }
    }
  }

  // Unique locations of in-area antinodes
  const locations = new Set<string>();
  Object.values(data).forEach(({ antis }) => {
    antis.forEach(({ x, y }) => {
      if (y < 0 || y >= height) return;
      if (x < 0 || x >= width) return;
      locations.add(`${x},${y}`);
    });
  });

  return locations.size;
};
