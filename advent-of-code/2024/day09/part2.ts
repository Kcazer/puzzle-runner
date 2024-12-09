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

  // Iterate over all files, in reverse, and inject them into the data
  data.filter((node) => node.type === "file").reverse().forEach((file) => {
    // First free space large enough to contain the file, that is also positionned before the file
    const freeLoc = data.findIndex((node) => node.type === "free" && node.size >= file.size);
    const fileLoc = data.findIndex((node) => node === file);
    if (freeLoc < 0 || freeLoc >= fileLoc) return;
    // Move old file to space, adding new smaller space if needed
    const free = data[freeLoc];
    data.splice(fileLoc, 1, { type: "free", size: file.size });
    if (file.size === free.size) data.splice(freeLoc, 1, file);
    else data.splice(freeLoc, 1, file, { ...free, size: free.size - file.size });
  });

  // Compute checksum
  return data.reduce((acc, node) => {
    // Free space do not change checksum
    if (node.type === "free") return (acc.pos += node.size, acc);
    // Sum from (pos) to (pos + size - 1) to multiply by ID
    const mul = ((2 * acc.pos + node.size - 1) * node.size) / 2;
    return { pos: acc.pos + node.size, sum: acc.sum + node.id * mul };
  }, { pos: 0, sum: 0 }).sum;
};
