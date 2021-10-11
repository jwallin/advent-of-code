import { getInput, sum } from '../../utils';
import { Position, manhattanDistance } from '../../utils/position';
import { KeyVal } from '../../utils/types';

async function partOne() {
  const input = (await getInput()).map(x => x.split(', ').map(Number)).map<Position>(([x, y]) => ({x, y}));
  const maxX = Math.max(...input.map(p => p.x));
  const maxY = Math.max(...input.map(p => p.y));
  const minX = Math.min(...input.map(p => p.x));
  const minY = Math.min(...input.map(p => p.y));
  
  const areas:KeyVal<number> = {};
  input.forEach((x,i) => {
    areas[i] = 0;
  });

  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      const distances = input.map(i => manhattanDistance({x, y}, i)); 
      const minDistance = Math.min(...distances);
      if (distances.filter(d => d === minDistance).length > 1) {
        continue;
      }
      const i = distances.indexOf(Math.min(...distances));
      areas[i]++;
    }
  }

  const contestants = input.reduce<number[]>((acc, p, i) => {
    if (p.x !== maxX && p.x !== minX && p.y !== maxY && p.y !== minY) {
      return acc.concat([i]);
    }
    return acc;
  }, []);

  const maxArea = Math.max(...contestants.map(c => areas[c.toString()]));

  console.log(maxArea)
}

async function partTwo(totalDistanceLessThan:number) {
  const input = (await getInput()).map(x => x.split(', ').map(Number)).map<Position>(([x, y]) => ({x, y}));

  const maxX = Math.max(...input.map(p => p.x));
  const maxY = Math.max(...input.map(p => p.y));
  const minX = Math.min(...input.map(p => p.x));
  const minY = Math.min(...input.map(p => p.y));

  let size = 0;  
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      const distanceSum = input.map(i => manhattanDistance({x, y}, i)).reduce(sum); 
      if (distanceSum < totalDistanceLessThan) {
        size++;
      }
    }
  }
  console.log(size);
}
  

partTwo(10000);