export default ({ input }: Input) => {
  const [time, ...buses] = (input.match(/\d+/g) ?? []).map(Number);
  const next = buses
    .map((bus) => ({ bus, wait: Math.ceil(time / bus) * bus - time }))
    .sort((a, b) => a.wait - b.wait)[0];

  return next.bus * next.wait;
};
