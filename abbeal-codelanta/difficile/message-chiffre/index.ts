export default ({ input }: Input) => {
  const mapping: Partial<Record<string, string>> = {
    e: "a",
    a: "e",
    z: "c",
    c: "z",
    f: "s",
    s: "f",
  };

  const value = input.replace(/./g, (c) => mapping[c] ?? c);
  throw new Error(value);
};
