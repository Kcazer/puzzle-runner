export default ({ input }: Input) => {
  const data = input.split("\n").map((v) => v.replace(/[^0-9+*()]/g, ""));

  const add = (a: string, b: string) => `${parseInt(a, 10) + parseInt(b, 10)}`;
  const mul = (a: string, b: string) => `${parseInt(a, 10) * parseInt(b, 10)}`;
  const run = (expr: string) => {
    let [curr, prev] = [expr, ""];

    do {
      prev = curr;
      curr = curr.replace(/\((\d+)\)/g, "$1");
      curr = curr.replace(
        /(\d+)([+*])(\d+)/,
        (_, a, o, b) => (o === "+" ? add : mul)(a, b),
      );
    } while (curr !== prev);

    return curr;
  };

  const results = data.map((e) => parseInt(run(e), 10));
  return results.reduce((s, v) => s + v, 0);
};
