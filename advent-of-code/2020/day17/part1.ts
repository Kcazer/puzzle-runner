export default ({ input }: Input) => {
  type Node = { x: number; y: number; z: number; active: boolean };

  const data = new Map<string, Node>();
  input.split("\n").forEach((row, y) => {
    row.split("").forEach((cell, x) => {
      if (cell !== "#") return;
      const node = { x, y, z: 0, active: true };
      data.set(`${x}/${y}/0`, node);
    });
  });

  const step = (curr: Map<string, Node>) => {
    // Create the new space, all empty for now
    const next = new Map<string, Node>();
    curr.forEach(({ x, y, z }) => {
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dz = -1; dz <= 1; dz++) {
            const node = { x: x + dx, y: y + dy, z: z + dz, active: false };
            next.set(`${node.x}/${node.y}/${node.z}`, node);
          }
        }
      }
    });
    // Iterate each new entry
    next.forEach((node, key) => {
      // Count active neighbours
      let count = 0;
      const { x, y, z } = node;
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dz = -1; dz <= 1; dz++) {
            if (!dx && !dy && !dz) continue;
            const tmp = `${x + dx}/${y + dy}/${z + dz}`;
            if (curr.get(tmp)?.active) count++;
          }
        }
      }
      // Update node
      const active = curr.get(key)?.active ?? false;
      node.active = count === 3 || (active && count === 2);
    });
    // Remove inactive and return result
    next.forEach((node, key) => !node.active && next.delete(key));
    return next;
  };

  const _print = (curr: Map<string, Node>) => {
    // Get space boundaries
    const rx = { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY };
    const ry = { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY };
    const rz = { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY };
    curr.forEach(({ x, y, z }) => {
      if (x < rx.min) rx.min = x;
      if (x > rx.max) rx.max = x;
      if (y < ry.min) ry.min = y;
      if (y > ry.max) ry.max = y;
      if (z < rz.min) rz.min = z;
      if (z > rz.max) rz.max = z;
    });
    // Create display
    const zz: string[][][] = [];
    for (let z = rz.min; z <= rz.max; z++) {
      const yy: string[][] = [];
      for (let y = ry.min; y <= ry.max; y++) {
        const xx: string[] = [];
        for (let x = rx.min; x <= rx.max; x++) {
          const node = curr.get(`${x}/${y}/${z}`);
          xx.push(node?.active ? "#" : ".");
        }
        yy.push(xx);
      }
      zz.push(yy);
    }

    // Print display
    zz.forEach((yy, z) => {
      console.log("\nz =", z + rz.min);
      console.log(yy.map((xx) => xx.join("")).join("\n"));
    });
  };

  let space = data;
  for (let i = 0; i < 6; i++) {
    // console.log(`\n\n\nAfter ${i + 1} cycles`);
    space = step(space);
    // _print(space);
  }

  return space.size;
};
