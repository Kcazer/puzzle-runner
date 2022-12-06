export default ({ input }: Input) => {
  return [...input].findIndex((_, i) => {
    const chunk = input.slice(i, i + 14);
    return new Set([...chunk]).size == 14;
  }) + 14;
};
