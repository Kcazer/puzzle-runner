export default ({ input }: Input) => {
  const int = (v: string) => parseInt(v, 10);
  const Validators: Record<string, (v: string) => boolean> = {
    byr: (v: string) => /^\d{4}$/.test(v) && int(v) >= 1920 && int(v) <= 2002,
    iyr: (v: string) => /^\d{4}$/.test(v) && int(v) >= 2010 && int(v) <= 2020,
    eyr: (v: string) => /^\d{4}$/.test(v) && int(v) >= 2020 && int(v) <= 2030,
    hgt: (v: string) =>
      (/^\d+in$/.test(v) && int(v) >= 59 && int(v) <= 76) ||
      (/^\d+cm$/.test(v) && int(v) >= 150 && int(v) <= 193),
    hcl: (v: string) => /^#[0-9a-f]{6}$/.test(v),
    ecl: (v: string) =>
      ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(v),
    pid: (v: string) => /^\d{9}$/.test(v),
  };

  return input
    .split("\n\n")
    .map((passport) =>
      passport.match(/(^|\s)(byr|iyr|eyr|hgt|hcl|ecl|pid):\S+/g)
    )
    .map((matches) => (matches ?? []).map((match) => match.trim()))
    .filter((trimmed) =>
      trimmed.every((item) => {
        const [key, value] = item.split(":");
        if (!Validators[key]) return false;
        return Validators[key](value);
      })
    )
    .map((trimmed) => trimmed.map((item) => item.split(":")[0]))
    .filter((keys) => new Set(keys).size === 7).length;
};
