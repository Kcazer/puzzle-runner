import levenshtein from "https://deno.land/x/levenshtein/mod.ts";

// Configuration
const useMock = true;
const cache = new Map<string, number>();

// Local mock to avoid spamming API
const getScoreFromMock = (answer: string) => {
  const solved = "Il est impossible de faire meilleure énigme";
  return Number(levenshtein(answer, solved));
};

// Network based score computation
const getScoreFromNetwork = async (answer: string) => {
  const res = await fetch(
    "https://codelanta.herokuapp.com/strangeCounter",
    { method: "POST", body: JSON.stringify({ answer }) },
  );
  return Number((await res.json()).value);
};

// Compute score (use cache for performance)
const getScore = async (answer: string) => {
  const cached = cache.get(answer);
  if (cached != null) return cached;

  const score = useMock
    ? getScoreFromMock(answer)
    : await getScoreFromNetwork(answer);
  cache.set(answer, score);
  return score;
};

// Find a better word by inserting `char` inside `base`
const getBetterWord = async (base: string, char: string) => {
  let word = base;
  for (let i = 0; i <= base.length; i++) {
    const test = `${base.slice(0, i)}${char}${base.slice(i)}`;
    if (await getScore(test) < await getScore(word)) word = test;
  }
  return word;
};

export default async () => {
  // Fetch the worst possible score
  const worst = await getScore("");

  // Iterate all possible characters, and mark a character as
  // present in the final word if the score if better than `worst`
  const chars: string[] = [];
  for (let i = 0; i < 256; i++) {
    const char = String.fromCharCode(i);
    const score = await getScore(char);
    if (score < worst) chars.push(char);
  }

  // We start with an empty string, then we try adding one character
  // in every possible position of the string. For every position,
  // we check the score and we keep going until it stabilize.
  // When the score stop improving, we use the next char.
  let word = "";
  for (let i = 0; i < chars.length; i++) {
    while (true) {
      const next = await getBetterWord(word, chars[i]);
      if (next === word) break;
      word = next;
    }
  }

  return word;
};
