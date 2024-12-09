export default ({ input }: Input) => {
  type File = { type: "file"; size: number; id: number };
  type Free = { type: "free"; size: number };
  type Node = File | Free;
  type Data = Node[];

  // Parse input
  const data: Data = input.trim().split("").map((size, i) => {
    if (i % 2) return { type: "free", size: +size };
    return { id: i / 2, type: "file", size: +size };
  });

  // Iterate over data
  const disk: File[] = [];
  while (true) {
    // Take first item
    const node = data.shift();
    if (node == null) break;
    // If file, append and continue
    if (node.type === "file") {
      disk.push(node);
      continue;
    }
    // If free, pull `item.size` from the end
    while (node.size > 0) {
      // Get last file
      const file = data.pop();
      if (file == null) break;
      if (file.size === 0) continue;
      if (file.type === "free") continue;
      // Reduce "filler" size and put it back
      const size = Math.min(file.size, node.size);
      data.push({ ...file, size: file.size - size });
      // Insert generated file in output array
      disk.push({ ...file, size });
      node.size -= size;
    }
  }

  // Compute checksum
  return disk.reduce((acc, file) => {
    // Sum from (pos) to (pos + size - 1) to multiply by ID
    const mul = ((2 * acc.pos + file.size - 1) * file.size) / 2;
    return { pos: acc.pos + file.size, sum: acc.sum + file.id * mul };
  }, { pos: 0, sum: 0 }).sum;
};
