import { getInput, sum} from '../../utils';

async function partOne() {
  const v = (await getInput()).map(Number).reduce(sum, 0);
  console.log(v);
}

async function partTwo() {
    const seenFrequencies = new Set<number>();
    
    const vals = (await getInput()).map(Number);
    let freq = 0;
    let hasFound = false;
    while(!hasFound) {
        for (let i = 0; i < vals.length; i++) {
            freq += vals[i];
            if (seenFrequencies.has(freq)) {
                console.log(freq);
                hasFound = true;
            } else {
                seenFrequencies.add(freq);
            }
        }
    }
    
  }
  

partTwo();