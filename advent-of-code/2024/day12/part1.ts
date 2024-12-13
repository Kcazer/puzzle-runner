export default ({ input }: Input) => {
  // For each plot of land, we store its position, plant type, region number, and siblings
  type Plot = {
    y: number;
    x: number;
    plant: string;
    region: Plot[] | null;
    neighbors: Record<"N" | "E" | "S" | "W", Plot | null>;
  };

  // Parse input into a 2D array of plots
  const data: Plot[][] = input.split("\n").map((row, y) => {
    return row.split("").map((plant, x) => {
      const neighbors = { N: null, S: null, W: null, E: null };
      return { y, x, plant, region: null, neighbors };
    });
  });

  // Create regions by iterating the area
  const regions: Plot[][] = [];
  for (let areaY = 0; areaY < data.length; areaY++) {
    for (let areaX = 0; areaX < data[areaY].length; areaX++) {
      // Skip if already in a region
      const root = data[areaY][areaX];
      if (root.region != null) continue;
      // Create new region
      root.region = [root];
      regions.push(root.region);
      // Iterate the region while expanding it
      for (let i = 0; i < root.region.length; i++) {
        // Check current plot location
        const plot = root.region[i];
        const { y, x } = plot;
        // Update region and neighbors
        plot.region = root.region;
        plot.neighbors = {
          N: data[y - 1]?.[x] ?? null,
          E: data[y]?.[x + 1] ?? null,
          S: data[y + 1]?.[x] ?? null,
          W: data[y]?.[x - 1] ?? null,
        };
        // Expand region with region-less, direct contact plots that use the same plant
        for (const neighbor of [plot.neighbors.N, plot.neighbors.E, plot.neighbors.S, plot.neighbors.W]) {
          if (!neighbor || !!neighbor.region || neighbor.plant !== root.plant) continue;
          (neighbor.region = root.region).push(neighbor);
        }
      }
    }
  }

  // Compute stats for each region
  const stats = regions.map((region) => {
    // Number of plots in the region
    const area = region.length;

    // For each plot, the number of neighbors in a different region
    // Then sum it to get the number of fences needed for enclosure
    const perimeter = region.map(({ neighbors }) => {
      const fenceN = neighbors.N?.region !== region ? 1 : 0;
      const fenceE = neighbors.E?.region !== region ? 1 : 0;
      const fenceS = neighbors.S?.region !== region ? 1 : 0;
      const fenceW = neighbors.W?.region !== region ? 1 : 0;
      return fenceN + fenceE + fenceS + fenceW;
    }).reduce((p, c) => p + c, 0);

    return { region, area, perimeter };
  });

  // Return total price
  return stats
    .map((r) => r.area * r.perimeter)
    .reduce((total, price) => total + price, 0);
};
