export default ({ input }: Input) => {
  // Used to convert a card face into an hexadecimal number
  const Faces = new Map([["A", "e"], ["K", "d"], ["Q", "c"], ["J", "b"], ["T", "a"]]);

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

  const hands = input.trim().split("\n")
    // Extract hand and bid, compute kind and value
    .map((line) => {
      const [hand, _bid] = line.split(" ");
      const value = getHandValue(hand);
      const kind = getHandKind(hand);
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
