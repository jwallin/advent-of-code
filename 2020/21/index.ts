import { getInput, unique, intersection } from '../../utils';

type Food = {
  ingredients: string[],
  allergens: string[]
};

function parseFood(input: string[]):Food[] {
  return input.map(x => {
    const parts = x.match(/([A-Za-z\s]+)\s\(contains\s([a-zA-Z,\s]+)\)/) || [];
    const ingredients = parts[1].split(' ');
    const allergens = parts[2].split(', ');
    return { ingredients, allergens };
  });
}

function sortAllergens(allergens:Map<string, string>):string[] {
  return [...allergens.keys()].sort((a, b) => {
    const valA = allergens.get(a) || '';
    const valB = allergens.get(b) || '';
    if (valA < valB) { return -1; }
    if (valA > valB) { return 1; }
    return 0;
  });
}

(async function run() {
  const input = await getInput();
  const food = parseFood(input);
  
  const allAllergens = unique(food.map(x => x.allergens).flat());
  const knownAllergens = new Map<string, string>();
  while (knownAllergens.size < allAllergens.length) {
    allAllergens.filter(x => !knownAllergens.has(x)).forEach(a => {
      //Find all food with allergen a
      const containsAllergens = food.filter(x => x.allergens.includes(a));
      
      //Do these foods only have one overlapping (unknown) ingredient?
      const overlapping = intersection(...containsAllergens.map(x => x.ingredients.filter(x => !knownAllergens.has(x))))
      if (overlapping.length === 1) {
        knownAllergens.set(overlapping[0], a);
      }
    });
  }
  
  console.log(`Part 1: ${food.map(f => f.ingredients).flat().filter(i => !knownAllergens.has(i)).length}`);

  const sorted = sortAllergens(knownAllergens);
  console.log(`Part 2: ${sorted.join(',')}`)
})();