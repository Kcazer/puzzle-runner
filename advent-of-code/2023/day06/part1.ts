export default ({ input }: Input) => {
  /*
  What we know
  ⏵ AllowedTime = PressTime + TravelTime
  ⏵ Distance = PressTime * TravelTime
  ⏵ Distance > Record

  Name each variable
  ⏵ t => AllowedTime
  ⏵ d => Distance
  ⏵ r => Record
  ⏵ x => PressTime
  ⏵ y => TravelTime

  Convert to MATHS
  ⏵ t = x + y
  ⏵ d = x * y
  ⏵ d > r

  Remember school
  ⏵ d = x * y
  ⏵ d = x * (t - x)
  ⏵ x * (t - x) > r
  ⏵ -x^x + x * t - r > 0
  ⏵ x^x - x * t + r < 0

  Remember school even more
  ⏵ Solution 1 => x < (t + sqrt(t^2 - 4 r)) / 2
  ⏵ Solution 2 => x > (t - sqrt(t^2 - 4 r)) / 2
  */
  const [times, dists] = input.trim().split("\n").map((line) => {
    return [...line.matchAll(/\d+/g)].map(Number);
  });

  const length = Math.min(times.length, dists.length);
  const rounds = Array.from({ length }, (_, i) => {
    const [t, d] = [times[i], dists[i]];
    const x1 = (t + Math.sqrt(t ** 2 - 4 * d)) / 2;
    const x2 = (t - Math.sqrt(t ** 2 - 4 * d)) / 2;
    const min = Math.floor(Math.min(x1, x2) + 1);
    const max = Math.ceil(Math.max(x1, x2) - 1);
    const val = max - min + 1;
    return { t, d, val };
  });

  return rounds.reduce((acc, { val }) => acc * val, 1);
};
