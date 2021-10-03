const fs = require('fs');

function printArr(a, i) {
  p(`Cursor ${i}: ${a}`)
}

function p(x) {
  console.log(x);
}

function calc(d) {
  //printArr(d, 0);
  for (let i = 0; i < d.length; i++) {
    if (d[i] === 1) {
      const a = d[d[++i]];
      const b = d[d[++i]];
      d[d[++i]] = a + b;
    } else if (d[i] === 2) {
      const a = d[d[++i]];
      const b = d[d[++i]];
      d[d[++i]] = a * b;
    } else if (d[i] === 99) {
      break;
    }
  }
  //p(d[0]);
  return d[0];
}

function calcWithNounAndVerb(arr, noun, verb) {
  const a = arr.slice();
  a[1] = noun; 
  a[2] = verb;
  return calc(a);
}

fs.readFile('input.txt', 'utf8', (err, data) => {
  const d = data.split(',').map(x => parseInt(x))

  //p(calcWithNounAndVerb(d, 12, 2))
  //return;
  for(let i = 0; i < 100; i++) {
    for(let j = 0; j < 100; j++) {
      const val = calcWithNounAndVerb(d, i, j);
      if (val === 19690720) {
        console.log(i, j);
        p(100 * i + j);
      }
      
    }
  }
});


//calc([1,1,1,4,99,5,6,0,99])