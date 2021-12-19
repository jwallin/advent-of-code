import { getInput } from '../../utils';
import { LinkedList } from '../../utils/linkedList';

function parseInput(input: string) {
  const regex = /^(\d+) players; last marble is worth (\d+) points/;
  const m = input.match(regex);
  if (!m) {
    throw new Error(`Couldnt parse input: ${input}`);
  }
  const [,players, maxMarble] = m;
  return [players, maxMarble].map(Number)
}

function play(numPlayers: number, maxMarble: number): number {
  const players = new Array(numPlayers).fill(0);
  let currentMarble = new LinkedList(0);
  currentMarble.left = currentMarble;
  currentMarble.right = currentMarble;
  for (let i = 1; i <= maxMarble; i++) {
    const currPlayer = i % numPlayers;
    if (i % 23 === 0) {
      const toRemove = currentMarble.stepLeft(7);
      players[currPlayer] += i + toRemove.value;
      currentMarble = toRemove.remove() as LinkedList<number>;
    } else {
      const toLeft = currentMarble.right as LinkedList<number>;
      const toRight = toLeft.right;
      currentMarble = new LinkedList(i, toLeft, toRight);
    }
  }
  return Math.max(...players);
}

async function partOne() {
  const [numPlayers, maxMarble] = (await getInput()).map(parseInput)[0];
  const highScore = play(numPlayers, maxMarble);

  console.log(highScore);
}

async function partTwo() {
  const [numPlayers, maxMarble] = (await getInput()).map(parseInput)[0];
  const highScore = play(numPlayers, maxMarble * 100);

  console.log(highScore);
}

partTwo();