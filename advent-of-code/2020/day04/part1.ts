export default ({ input }: Input) => {
  return input
    .split("\n\n")
    .map((passport) => passport.match(/(^|\s)(byr|iyr|eyr|hgt|hcl|ecl|pid):/g))
    .map((matches) => (matches ?? []).map((match) => match.trim()))
    .filter((trimmed) => new Set(trimmed).size === 7).length;
};
