export default ({ input }: Input) => {
  const data = input.split("\n");

  // Parse rules and messages
  const rules: string[] = [];
  const patterns = input.match(/^\d+: .+$/gm);
  const messages: string[] = input.match(/^\w+$/gm) ?? [];
  patterns?.map((v) => v.split(": ")).forEach(([k, v]) => (rules[+k] = v));

  // Overrides
  const overrides = [
    { index: 8, value: "42 | 42 8" },
    { index: 11, value: "42 31 | 42 11 31" },
  ];

  // Unroll each override enough to cover the longest message
  const count = 15; // Math.max(...messages.map(m => m.length));
  overrides.forEach(({ index, value }) => {
    const split = value.split(" | ");
    const regex = new RegExp(`(^| )${index}( |$)`, "g");
    while (Math.max(...split.map((v) => v.split(" ").length)) <= count) {
      const fixed = split.map((a) =>
        split.map((b) => b.replace(regex, `$1${a}$2`))
      );
      split.splice(0, split.length, ...new Set(fixed.flat()));
    }
    rules[index] = split.filter((v) => !regex.test(v)).join(" | ");
  });

  // Update group rules
  rules.forEach((rule, i) => {
    if (!rule.includes("|")) return;
    rules[i] = `(${rule})`;
  });

  // Expand rules
  while (
    !rules.every((value, index) => {
      rules[index] = value.replace(/\d+/g, (k) => `${rules[+k]}`);
      return value === rules[index];
    })
  );

  // Make final rule and match messages
  const rule = new RegExp(
    `^${rules[0].replace(/[ "]/g, "").replace(/[(]/g, "(?:")}$`,
  );
  const matches = messages.filter((message) => rule.test(message));

  return matches.length;
};
