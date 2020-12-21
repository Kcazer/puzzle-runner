export default ({ input }: Input) => {
  // Parse each food
  const data = input.split("\n").map((line) => {
    const matches = line.match(/^(.*) \(contains (.*)\)$/) ?? [];
    const ingredients = matches[1].split(" ");
    const allergens = matches[2].split(", ");
    return { ingredients, allergens };
  });

  // Create sets containing each ingredients and allergens
  const allAllergens = [...new Set(data.map((v) => v.allergens).flat())];
  const allIngredients = [...new Set(data.map((v) => v.ingredients).flat())];

  // Map each ingredient to a list of allergens it does not contains
  const mapping = allIngredients.map((ingredient) => {
    const notIncluded = allAllergens.filter((allergen) => {
      const check = data
        .filter((item) => item.allergens.includes(allergen))
        .filter((item) => !item.ingredients.includes(ingredient));
      return check.length > 0;
    });
    const noAllergen = notIncluded.length === allAllergens.length;
    return { ingredient, noAllergen };
  });

  // Count how many time each non-allergen ingredient is present
  const result = mapping
    .filter(({ noAllergen }) => {
      return noAllergen;
    })
    .map(({ ingredient }) => {
      return data.filter((item) => item.ingredients.includes(ingredient))
        .length;
    })
    .reduce((s, v) => {
      return s + v;
    }, 0);

  return result;
};
