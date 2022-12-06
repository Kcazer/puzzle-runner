export default ({ input }: Input) => {
  // Sadly, backreference are not alllowed in character classes, else this could
  //be solved with a simple regex => /(.)([^\1])([^\1\2])([^\1\2\3])/.exec(input)
  return [...input].findIndex((_, i) => {
    const chunk = input.slice(i, i + 4);
    return new Set([...chunk]).size == 4;
  }) + 4;
};
