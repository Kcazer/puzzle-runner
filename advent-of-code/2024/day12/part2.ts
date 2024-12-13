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

    // A bit of insanity, but here we go :
    // - Choose a direction (N, S, E, W) -- we'll do all of them anyway
    // - Take plots facing another region when looking in the choosen direction
    // - Sort the list according to the direction (liek so N=VH, S=VH, E=HV, W=HV)
    // - Remove plots that are adjacent to each other (=merge fences into a single side)
    // - Finally, sum the number of sides of every direction to get the number of side of the region
    const sideN = region
      .filter((plot) => plot.neighbors.N?.region !== region)
      .sort((plotA, plotB) => plotA.y - plotB.y || plotA.x - plotB.x)
      .filter((plot, i, { [i - 1]: prev }) => !prev || !(plot.y - prev.y === 0 && plot.x - prev.x === 1));
    const sideS = region
      .filter((plot) => plot.neighbors.S?.region !== region)
      .sort((plotA, plotB) => plotA.y - plotB.y || plotA.x - plotB.x)
      .filter((plot, i, { [i - 1]: prev }) => !prev || !(plot.y - prev.y === 0 && plot.x - prev.x === 1));
    const sideE = region
      .filter((plot) => plot.neighbors.E?.region !== region)
      .sort((plotA, plotB) => plotA.x - plotB.x || plotA.y - plotB.y)
      .filter((plot, i, { [i - 1]: prev }) => !prev || !(plot.x - prev.x === 0 && plot.y - prev.y === 1));
    const sideW = region
      .filter((plot) => plot.neighbors.W?.region !== region)
      .sort((plotA, plotB) => plotA.x - plotB.x || plotA.y - plotB.y)
      .filter((plot, i, { [i - 1]: prev }) => !prev || !(plot.x - prev.x === 0 && plot.y - prev.y === 1));
    const sides = sideN.length + sideS.length + sideE.length + sideW.length;

    return { region, area, sides };
  });

  // Return total price
  return stats
    .map((r) => r.area * r.sides)
    .reduce((total, price) => total + price, 0);
};
