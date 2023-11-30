export default ({ input }: Input) => {
  const words = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
  const regex = new RegExp(`(?=(${words.join("|")}|\\d))`, "g");
  const toDigit = (str: string) => words.indexOf(str) + 1 || Number(str);

  return input.trim().split("\n").map((line, i) => {
    const matches = [...line.matchAll(regex)];
    const digits = matches.map(([, v]) => toDigit(v));
    const [first, last] = [digits.at(0), digits.at(-1)];
    if (first != null && last != null) return first * 10 + last;
    throw new Error(`Unable to find digits on line [${i}] = ${line}`);
  }).reduce((sum, val) => sum + val, 0);
};
