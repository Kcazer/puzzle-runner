export default () => {
  // Setup
  const k = 6;
  const m = 100_000_007;
  const v = BigInt('4883416248931325596490412993257177102899835196397982194008099624821553008294238402646316547811356426326359030169023793089185062011225412540414051450210024844748364856407471917125916198877053760078566283474635381156706499252390663501420041259863047880286549117862141509763106523637627339561');

  // Fib(n) = k * Fib(n - 1) + Fib(n - 2)
  // Fib(0) = 0  and  Fib(1) = 1
  // Pop(n) = Fib(n) % m

  // Brute force the periodicity of Pop(n) by computing each term until we find [0, 1]
  // Since k and m are coprime, we can apply the modulo directly inside the loop
  // This allow us to fasten the computation and remove the need for BigInt
  // Note : The resulting value is called the `Pisano Period`
  let [a, b, p] = [0, 1, 0];
  do [a, b] = [b, (k * b + a) % m, p++];
  while (a !== 0 || b !== 1)

  // Since Pop(x) === Pop(x + p) we can simply compute Pop(v % p) instead of Pop(v)
  [a, b] = [0, 1];
  let n = Number(v % BigInt(p))
  while(n--) [a, b] = [b, (k * b + a) % m];

  return a;
}
