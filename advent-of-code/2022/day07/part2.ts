export default ({ input }: { input: string }) => {
  const lines = input.split("\n");

  let cwd = "/";
  const dirs = new Set<string>("/");
  const files = new Map<string, number>();
  lines.forEach((line) => {
    // Navigation
    if (line.startsWith("$ cd ")) {
      const p = line.substring(5);
      if (p[0] === "/") cwd = p;
      else cwd += p + "/";
      cwd = cwd.replace(/[^\/]+\/\.\.\//g, "");
      return;
    }
    // Find directory
    if (line.startsWith("dir ")) {
      dirs.add(`${cwd}${line.substring(4)}/`);
      return;
    }
    // Find file
    if (line.match(/^[0-9]+ /)) {
      const [size, file] = line.split(" ");
      files.set(`${cwd}${file}`, Number(size));
      return;
    }
  });

  // Compute total size of each folder
  const totals = [...dirs].map((dir) => {
    let total = 0;
    files.forEach((size, file) => {
      if (file.startsWith(dir)) total += size;
    });
    return { dir, total };
  });

  // Find
  const disk = 70000000;
  const need = 30000000;
  const used = totals.find((item) => item.dir === "/")!.total;
  const free = disk - used;
  const target = need - free;

  // Filter these >= target and keep the smallest
  return totals
    .filter((item) => item.total >= target)
    .sort((a, b) => a.total - b.total)
    .at(0)?.total;
};
