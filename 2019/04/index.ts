const MIN_VAL = 138241;
const MAX_VAL = 674034;

const options = [];

function hasAdjacent(numArray: number[]) {
  const groups = [];
  let ptr = 0;
  while (ptr < numArray.length) {
    const val = numArray[ptr];
    
    for (let i = 1; i <= numArray.length; i++) {
      if (numArray[ptr + i] !== val) {
        const newPtr = ptr + i;
        groups.push(numArray.slice(ptr, newPtr))
        ptr = newPtr;
        break;
      }
    }
   
  }
  return groups.some(g => g.length > 1) && groups.every(g => g.length === 1 || g.length === 2);
}
//console.log(hasAdjacent('222221'.split('').map(x => parseInt(x))))
for (let i = MIN_VAL; i <= MAX_VAL; i++) {
  const stringNum = i.toString();
  const numArray = stringNum.split('').map(x => parseInt(x));
  if (stringNum.length != 6) { continue; }
  
  // Always increasing
  let isAlwaysIncreasing = true;
  for (let k = 1; k<numArray.length; k++) {
    if (numArray[k-1] > numArray[k]) {
      isAlwaysIncreasing = false;
      break;
    }
  }
  if (!isAlwaysIncreasing) { continue; }

  const adj = hasAdjacent(numArray);
  console.log(`${stringNum}: ${adj}`)
  if (!hasAdjacent(numArray)) { continue; }

  options.push(i);
}

console.log(options.length)