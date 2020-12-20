export default ({ input }: Input) => {
  const data = input.match(/Tile \d+:[\n.#]+/g) ?? [];
  const size = 10;

  const getPixels = (text: string) => {
    return text.trim().split("\n").map((line) => {
      return line.trim().split("").map((cell) => {
        return cell === "#" ? 1 : 0;
      });
    });
  };

  const tiles = data.map((tile) => {
    const [head, body] = tile.slice(5).split(":");
    const values = Array(8).fill(0);
    const pixels = getPixels(body);
    const index = Number(head);
    for (let i = 0; i < size; i++) {
      values[0] = (values[0] << 1) | pixels[0][i];
      values[1] = (values[1] << 1) | pixels[0][size - 1 - i];
      values[2] = (values[2] << 1) | pixels[i][0];
      values[3] = (values[3] << 1) | pixels[size - 1 - i][0];
      values[4] = (values[4] << 1) | pixels[i][size - 1];
      values[5] = (values[5] << 1) | pixels[size - 1 - i][size - 1];
      values[6] = (values[6] << 1) | pixels[size - 1][i];
      values[7] = (values[7] << 1) | pixels[size - 1][size - 1 - i];
    }
    return { index, values, pixels };
  });

  const relations = tiles.map(({ index, values }) => {
    const neighbours = new Set<number>();
    values.forEach((value) => {
      tiles.forEach((t) => {
        if (!t.values.includes(value)) return;
        if (t.index === index) return;
        neighbours.add(t.index);
      });
    });
    return { index, neighbours };
  });

  const corners = relations.filter((v) => v.neighbours.size === 2);
  const result = corners.reduce((p, v) => p * v.index, 1);
  return result;
};
