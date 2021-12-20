export default ({ regular, weird }: Input) => {
  let delta = 0;
  const chars: string[] = [];

  regular.split("").forEach((char, pos) => {
    while (weird[pos + delta] !== char) {
      chars.push(weird[pos + delta]);
      delta += 1;
    }
  });

  return chars.join("");
};
