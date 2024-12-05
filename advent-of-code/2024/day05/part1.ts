export default ({ input }: Input) => {
  // Parse input to extract all rules and boooks
  const rules = [...input.matchAll(/\d+\|\d+/g)].map(([rule]) => rule);
  const books = [...input.matchAll(/^[\d,]+$/gm)].map(([book]) => book);

  // Prepare a regex to detect violations (pages are present BUT reversed)
  const ruleSplit = rules.map((rule) => rule.split("|"));
  const rulePatterns = ruleSplit.map(([x, y]) => `(?<!\\d)${y},.*(?<!\\d)${x}(?!\\d)`);
  const violationRegex = new RegExp(`(?:${rulePatterns.join("|")})`);

  // Find books without any violations
  const validBooks = books
    .filter((book) => !violationRegex.test(book))
    .map((book) => book.trim().split(",").map(Number));

  // Sum the middle pages of each book
  return validBooks
    .map((pages) => pages[(pages.length - 1) / 2])
    .reduce((sum, page) => sum + page, 0);
};
