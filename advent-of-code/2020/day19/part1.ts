export default ({ input }: Input) => {
  const data = input.split("\n");

  // Parse rules and messages
  const rules: string[] = [];
  const patterns = input.match(/^\d+: .+$/gm);
  const messages: string[] = input.match(/^\w+$/gm) ?? [];
  patterns?.map((v) => v.split(": ")).forEach(([k, v]) => (rules[+k] = v));

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
  const rule = new RegExp(`^${rules[0].replace(/[ "]/g, "")}$`);
  const matches = messages.filter((message) => rule.test(message));

  return matches.length;
};
