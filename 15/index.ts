import { getInput } from '../utils';

async function playGame(rounds:number) {
  const startingNumbers:number[] = (await getInput())[0].split(',').map(Number);
  
  let map = new Map<number, number>();
  let n:number = startingNumbers[startingNumbers.length - 1];
  let last:number | undefined;
  
  for (let i = 0; i < rounds; i++) {
    last = map.get(n) || 0;
    map.set(n, i);
    if (i < startingNumbers.length) {
      n = startingNumbers[i];
    } else {
      n = last ? i - last : 0; 
    }
  }
  console.log(n);
}

playGame(30000000);