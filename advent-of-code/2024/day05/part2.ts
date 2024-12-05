export default ({ input }: Input) => {
  // Parse input to extract all rules and boooks
  const rules = [...input.matchAll(/\d+\|\d+/g)].map(([rule]) => rule);
  const books = [...input.matchAll(/^[\d,]+$/gm)].map(([book]) => book);

  // Prepare a regex to detect violations (pages are present BUT reversed)
  const ruleSplit = rules.map((rule) => rule.split("|"));
  const rulePatterns = ruleSplit.map(([x, y]) => `(?<!\\d)${y},.*(?<!\\d)${x}(?!\\d)`);
  const violationRegex = new RegExp(`(?:${rulePatterns.join("|")})`);

  // Find and fix books violating the rules
  const validBooks = books
    .filter((book) => violationRegex.test(book))
    .map((invalidBook) => {
      // List of pages and related rules
      const invalidPages = invalidBook.trim().split(",");
      const currentRules = ruleSplit.filter(([x, y]) => invalidPages.includes(x) && invalidPages.includes(y));
      // Remove root rules till none left
      const validPages: string[] = [];
      while (currentRules.length > 0) {
        // Find a rule that has no ancestor
        const rootRule = currentRules.find(([x]) => currentRules.every(([_, y]) => x !== y));
        if (rootRule == null) throw new Error("Unable to find a rule without ancestor");
        // Keep only the non-root rules and update the list of valid pages
        const remainingRules = currentRules.filter(([x]) => x !== rootRule[0]);
        currentRules.splice(0, Infinity, ...remainingRules);
        validPages.splice(-1, 1, ...rootRule);
      }
      // Fixed page as numbers
      return validPages.map(Number);
    });

  // Sum the middle pages of each book
  return validBooks
    .map((pages) => pages[(pages.length - 1) / 2])
    .reduce((sum, page) => sum + page, 0);
};
