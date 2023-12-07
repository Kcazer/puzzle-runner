export default ({ input }: Input) => {
  // Used to convert a card face into an hexadecimal number
  const Faces = new Map([["A", "e"], ["K", "d"], ["Q", "c"], ["J", "0"], ["T", "a"]]);

  // List of all the possible values the joker can turn into
  const Joker = ["A", "K", "Q", "T", "9", "8", "7", "6", "5", "4", "3", "2"];

  /**
   * Compute hand value by converting it into an hexadecimal number
   * Since this is only used for sorting hands, we need the cards to have
   * increasing values from 2 to A, but the values themselves don't matter
   */
  const getHandValue = (hand: string) => {
    const map = (c: string) => Faces.get(c) ?? c;
    const hex = hand.replace(/[AKQJT]/g, map);
    return parseInt(hex, 16);
  };

  /**
   * Return the kind of hand, from 0 (nothing) to 6 (5 of a kind)
   * The matching is done in descending order, and first match is
   * returned. Only used for sorting, so the values don't matter.
   */
  const getHandKind = (hand: string) => {
    const sorted = hand.split("").sort().join("");
    if (/(.)\1{4}/.test(sorted)) return 6; // 5 of a kind
    if (/(.)\1{3}/.test(sorted)) return 5; // 4 of a kind
    if (/(.)\1{2}(.)\2/.test(sorted)) return 4; // Full house XXXYY
    if (/(.)\1(.)\2{2}/.test(sorted)) return 4; // Full house XXYYY
    if (/(.)\1{2}/.test(sorted)) return 3; // Three of a kind
    if (/(.)\1.(.)\2/.test(sorted)) return 2; // Two pairs XXAYY
    if (/(.)\1(.)\2/.test(sorted)) return 2; // Two pairs AXXYY + XXYYA
    if (/(.)\1/.test(sorted)) return 1; // One pair
    return 0; // Nothing
  };

  /**
   * Generate all possible hands by replacing the jokers with every
   * possible values. This is done recursively using a generator in
   * order to be able to break early if a perfect hand is found.
   */
  function* getPossibleHands(hand: string): Generator<string> {
    if (hand.includes("J")) {
      for (const option of Joker) {
        const h = hand.replace("J", option);
        yield* getPossibleHands(h);
      }
    } else yield hand;
  }

  /**
   * V1: Iterate over all possible hands. Worst complexity = O(n)
   * From a given hand, iterate over all the possible combinations
   * by replacing the jokers. For each combination, compute the kind
   * of hand and return the best of all. Early return on perfect hand.
   */
  const getBestHandKindV1 = (hand: string) => {
    let kind = 0;
    for (const h of getPossibleHands(hand)) {
      kind = Math.max(kind, getHandKind(h));
      if (kind === 6) break;
    }
    return kind;
  };

  /**
   * V2: Use heuristic to find the best hand. Complexity = O(1)
   * From a given hand, find out the most used card, besides jokers,
   * then replace all jokers with that kind of card. Since valid hands
   * only depends on card repetitions, this will create the best result.
   */
  const getBestHandKindV2 = (hand: string) => {
    // Skip when all jokers, or no jokers
    if (!hand.includes("J")) return getHandKind(hand);
    // Count each kind of card
    const counts = new Map<string, number>();
    for (const card of hand.split("")) {
      const count = counts.get(card) ?? 0;
      counts.set(card, count + 1);
    }
    // Find most used card, besides jokers
    const most = [...counts.entries()]
      .filter(([char]) => char !== "J")
      .sort(([, a], [, b]) => b - a)
      .pop();
    // Replace jokers with that card
    const card = most?.[0] ?? "X";
    const best = hand.replaceAll("J", card);
    return getHandKind(best);
  };

  const hands = input.trim().split("\n")
    // Extract hand and bid, compute best kind and value
    .map((line) => {
      const [hand, _bid] = line.split(" ");
      const value = getHandValue(hand);
      const kind = getBestHandKindV2(hand);
      const bid = Number(_bid);
      return { hand, kind, value, bid };
    })
    // Sort each hand, first by kind, then by value
    .sort((a, b) => {
      return (a.kind - b.kind) || (a.value - b.value);
    })
    // Compute the total win based on ranking and bid
    .map((item, i) => {
      const rank = i + 1;
      const win = rank * item.bid;
      return { ...item, rank, win };
    });

  return hands.reduce((sum, item) => sum + item.win, 0);
};
