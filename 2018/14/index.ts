import { sum } from '../../utils';


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

function existsInArray(inputDigits: number[], recipeScores: number[]) {
  let index: number | undefined = undefined;
  for (let i = 0; i < recipeScores.length - inputDigits.length; i++) {
    if (recipeScores.slice(i, i + inputDigits.length).every((x, j) => x === inputDigits[j])) {
      index = i;
    }
  }
  return index;
}

function toDigits(i: number) {
  return i.toString().split('').map(Number);
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

async function partTwo(i: number) {
  const recipeScores = [3, 7];
  let elves = [0, 1];
  let index = 0;
  let positionToCheck = 0;
  const digitsToFind = toDigits(i);
  let found = false;

  while (!found) {  
    const newRecipes = toDigits(elves.map(x => recipeScores[x]).reduce(sum));
    recipeScores.push(...newRecipes);
    
    elves = elves.map(x => (x + recipeScores[x] + 1) % recipeScores.length);

    while (index + positionToCheck < recipeScores.length) {
      if (digitsToFind[positionToCheck] === recipeScores[index + positionToCheck]) {
        if (positionToCheck === digitsToFind.length - 1) {
          found = true;
          console.log(index);
          break;
        }
        positionToCheck++;
      } else {
        positionToCheck = 0;
        index++;
      }
    }

    //drawRecipes(recipeScores, elves);  
  }
}
  
partTwo(793031);