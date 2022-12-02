import { getInput, sum } from '../../utils';

enum Hand {
  Rock = 1,
  Paper = 2,
  Scissors = 3,
}

enum Result {
  Lost = -1,
  Won = 1,
  Draw = 0
}

const Score = {
  [Result.Won]: 6,
  [Result.Draw]: 3,
  [Result.Lost]: 0
};

function calcScore(opponent: Hand, me: Hand): number {
  const result = (me - opponent + 1 + 3) % 3 - 1 as Result;
  return Score[result] + me;
}

async function partOne() {
  const d = {
    A: Hand.Rock,
    B: Hand.Paper,
    C: Hand.Scissors,

    X: Hand.Rock,
    Y: Hand.Paper,
    Z: Hand.Scissors
  };

  const input = (await getInput()).map(x => x.split(' ').map(y => d[y as keyof typeof d]));
  console.log(input.map(([opp, me]) => calcScore(opp, me)).reduce(sum));
}

function calcWhatToPlay(opponent: Hand, result: Result): Hand {
  return (opponent + result - 1 + 3) % 3 + 1;
}

async function partTwo() {

  const firstCol = {
    A: Hand.Rock,
    B: Hand.Paper,
    C: Hand.Scissors
  };

  const secondCol = {
    X: Result.Lost,
    Y: Result.Draw,
    Z: Result.Won
  }

  const input = (await getInput()).map(x => x.split(' ')).map(([y,  z]) => {
    const opp = firstCol[y as keyof typeof firstCol];
    const res = secondCol[z as keyof typeof secondCol];
    const me = calcWhatToPlay(opp, res)
    return [opp, me];
  });

  console.log(input.map(([opp, me]) => calcScore(opp, me)).reduce(sum));
}
  

partOne();
partTwo();