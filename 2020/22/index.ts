import { getInput, splitArray, range } from '../../utils';

class Player {
  private _name: string;
  private _cards: number[];

  constructor(name: string | undefined, cards: number[]) {
    this._name = name || '';
    this._cards = cards;
  }

  get name(): string {
    return this._name
  }
  
  get deck(): number[] {
    return this._cards;
  }

  draw(): number {
    return this.deck.shift() || -1;
  }

  hasCard(): boolean {
    return this.deck.length > 0;
  }

  winsCards(...cards: number[]) {
    this.deck.push(...cards);
  }

  calculateScore(): number {
    const numOfCards = this.deck.length;
    return range(numOfCards).reverse().reduce((prev, k, i) => prev + this.deck[i] * (k + 1), 0);
  }
  
  cardsLeft(): number {
    return this.deck.length;
  }
}

function toKey(...input:number[][]):string {
  return input.map(x => x.join(',')).join(';');
}

function playGame(p1:Player, p2: Player, recursiveRule:boolean = false): string {
  const memo:Set<string> = new Set();
  
  while (p1.hasCard() && p2.hasCard()) {
    const key = toKey(p1.deck, p2.deck);
    if (memo.has(key)) {
      return p1.name;
    }
    memo.add(key);

    const p1card = p1.draw();
    const p2card = p2.draw();

    if (recursiveRule && p1.cardsLeft() >= p1card && p2.cardsLeft() >= p2card) {
      const winner = playGame(new Player(p1.name, p1.deck.slice(0, p1card)), new Player(p2.name, p2.deck.slice(0, p2card)), true);
      if (winner === p1.name) {
        p1.winsCards(p1card, p2card);
      } else {
        p2.winsCards(p2card, p1card);
      }
    } else {
      if (p1card > p2card) {
        p1.winsCards(p1card, p2card);
      } else {
        p2.winsCards(p2card, p1card);
      }
    }  
  }
  return (p1.calculateScore() > p2.calculateScore()) ? p1.name : p2.name;
}

async function run(recursive = false) {
  const input = splitArray(await getInput(), '');
  const [player1, player2] = input.map(p => {
    return new Player(p.shift(), p.map(Number));
  });
  
  playGame(player1, player2, recursive)

  console.log(`Player 1 score: ${player1.calculateScore()}`);
  console.log(`Player 2 score: ${player2.calculateScore()}`);
}

(async () => {
  console.log('Part one:');
  await run(false);

  console.log('');
  console.log('Part two:');
  await run(true);
})();
