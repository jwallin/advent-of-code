import { getInput, sum } from '../../utils';


function drawRecipes(recipeScores: number[], elves: number[]) {
  const str = recipeScores.map((x, i) => {
    if (elves[0] === i) {
      return `(${x})`;
    } else if (elves[1] === i) {
      return `[${x}]`;
    }
    return ` ${x} `;
  }).join(' ');
  console.log(str);
}


async function partOne(i: number) {
  const recipeScores = [3, 7];
  let elves = [0, 1];

  while (recipeScores.length < 10 + i) {
    const newRecipes = elves.map(x => recipeScores[x]).reduce(sum).toString().split('').map(Number);
    recipeScores.push(...newRecipes);
    elves = elves.map(x => (x + recipeScores[x] + 1) % recipeScores.length);
    
    //drawRecipes(recipeScores, elves);  
  }
  console.log(recipeScores.slice(i, i + 10).join(''));
}

async function partTwo() {
  const input = (await getInput()).map(Number);
}
  

partOne(793031);