export default ({ input }: Input) => {
  // Typings
  type Node = { N: string; L: string; R: string };

  // Extract path
  const isDirection = (v: string): v is "R" | "L" => v === "R" || v === "L";
  const path = input.split("\n").shift()?.split("").filter(isDirection) ?? [];

  // Extract nodes
  const nodes = new Map<string, Node>();
  [...input.matchAll(/(\w+) = \((\w+), (\w+)\)/g)]
    .forEach(([, N, L, R]) => nodes.set(N, { N, L, R }));

  // Compute distance for each entry point
  const list = [...nodes.values()].filter(({ N }) => N.endsWith("A"));
  const dist = list.map((node) => {
    let step = 0;
    do {
      const next = nodes.get(node[path[step++ % path.length]]);
      if (next == null) throw new Error("Oh noes, I'm lost !");
      node = next;
    } while (!node.N.endsWith("Z"));
    return step;
  });

  // Now we only need to find the LCM
  const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
  const lcm = (a: number, b: number): number => a * b / gcd(a, b);
  return dist.reduce(lcm);
};
