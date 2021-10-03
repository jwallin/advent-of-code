const DIVIDER = 20201227;
const MAX = 100000000;

function transform(subject: number, loopSize: number, toFind: number | undefined = undefined) {
  let v = 1;
  for (let i = 0; i < loopSize; i++) {
    v = (v * subject) % DIVIDER;
    if (v === toFind) {
      return i + 1;
    }
  }
  
  if (toFind) {
    throw new Error(`Couldnt find number ${toFind}`);
  }

  return v;
}

function partOne() {
  let cardPbk = 2084668;
  let doorPbk = 3704642;
  const subjectNumber = 7;

  const cardLoopSize = transform(subjectNumber, MAX, cardPbk);
  const doorLoopSize = transform(subjectNumber, MAX, doorPbk);

  console.log(transform(cardPbk, doorLoopSize));
  console.log(transform(doorPbk, cardLoopSize));
}

partOne();