export default ({ input }: Input) => {
  // Typings
  type Node = { N: string; L: string; R: string };

  // Extract path
  const isDirection = (v: string): v is "R" | "L" => v === "R" || v === "L";
  const path = input.split("\n").shift()?.split("").filter(isDirection) ?? [];

  // Extract nodes
  const nodes = new Map<string, Node>();
  [...input.matchAll(/(\w+) = \((\w+), (\w+)\)/g)].forEach((match) => {
    const [, N, L, R] = match;
    nodes.set(N, { N, L, R });
  });

  // Start walking
  let step = 0;
  let node = nodes.get("AAA")!;
  do {
    const next = nodes.get(node[path[step++ % path.length]]);
    if (next == null) throw new Error("Oh noes, I'm lost !");
    node = next;
  } while (node.N !== "ZZZ");

  return step;
};
