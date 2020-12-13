export default ({ input }: Input) => {
  const data = input.split("\n")[1].split(",")
    .map((v, i) => [-i, v] as const)
    .filter(([, v]) => v !== "x")
    .map((x) => x.map(BigInt));

  const normal = (val: bigint, mod: bigint) => {
    return ((val % mod) + mod) % mod;
  };

  const euclid = (a: bigint, b: bigint) => {
    const z = BigInt(0);
    let [r, rr] = [a, b];
    let [u, uu] = [BigInt(1), BigInt(0)];
    let [v, vv] = [BigInt(0), BigInt(1)];
    while (rr != z) {
      const q = r / rr;
      [r, rr] = [rr, r - q * rr];
      [u, uu] = [uu, u - q * uu];
      [v, vv] = [vv, v - q * vv];
    }
    return { a, b, r, u, v };
  };

  const bezout = (a: bigint, b: bigint, m: bigint, n: bigint) => {
    const { u, v } = euclid(m, n);
    const [um, vn] = [u * m, v * n];
    return (a * vn + b * um) / (um + vn);
  };

  while (data.length > 1) {
    const [a, m] = data.shift()!;
    const [b, n] = data.shift()!;
    const x = bezout(a, b, m, n);
    data.unshift([normal(x, m * n), m * n]);
  }

  const [v, m] = data.pop()!;
  return normal(v, m);
};
