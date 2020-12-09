export function* combinations(array: number[], k:number, start:number = 0): Generator<number[]> {
  if (k === 1 || start == array.length) {
    for(let i = start; i < array.length; i++) {
      yield [array[i]];
    }
  } else {
    for (let i = start; i < array.length; i++) {
      const permutations = combinations(array, k - 1, i + 1);
      for(const x of permutations) {
        yield [array[i], ...x];  
      }
    }
  }
}