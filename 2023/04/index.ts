import { getInput } from '../../utils';

class Card {
  winning: number[];
  mine: number[];
  id: number;

  constructor(id: number, winning: number[], mine: number[]) {
    this.id = id;
    this.winning = winning;
    this.mine = mine;
  }

  numWins() {
    return this.mine.filter(x => this.winning.includes(x)).length;
  }
}

async function parseCards() {
  return (await getInput()).map(card => {
    const [cardName, nums] = card.split(': ');
    const id = Number(cardName.replace(/[^\d]+/g, ''));
    const [winning, mine] = nums.split(' | ').map(d => d.split(' ').filter(x => x.length > 0).map(Number));
    return new Card(id, winning, mine);
  });
}

async function partOne() {
  const points = (await parseCards()).reduce((acc, card) => {
    const numWins = card.numWins();
    if (numWins === 0) {
      return acc;
    }
    return acc + Math.pow(2, numWins - 1);
  }, 0);
  console.log(points);
}

async function partTwo() {
  const cardsList = await parseCards();
  
  const cards = [...cardsList];
  let totalNumCards = cards.length;
  while (cards.length > 0) {
    const c = cards.pop()!;
    for (let i = c.id; i < c.id + c.numWins(); i++) {
      cards.push(cardsList[i]);
      totalNumCards++;
    }
  }
  console.log(totalNumCards)
}
  
partOne();
partTwo();

