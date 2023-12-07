import { getInput } from '../../utils';

const CARD_VALUES = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'].reverse();

enum HandResult {
  FiveOfAKind = 6,
  FourOfAKind = 5,
  FullHouse = 4,
  ThreeOfAKind = 3,
  TwoPair = 2,
  Pair = 1,
  HighCard = 0
}

class Hand {
  cards: string[];
  bid: number;

  constructor(cards: string, bid: number) {
    this.cards = cards.split('');
    this.bid = bid;
  }

  countInstances() {
    const seenCards = this.cards.reduce((acc, x) => {
      const cardCount = acc.get(x);
      if (cardCount === undefined) {
        acc.set(x, 1);
      } else {
        acc.set(x, cardCount + 1);
      }
      return acc;
    }, new Map<string, number>());
    return [...seenCards.values()].sort().reverse();
  }

  value() {
    const [first, second] = this.countInstances();
    if (first === 5) {
      return HandResult.FiveOfAKind;
    }
    if (first === 4) {
      return HandResult.FourOfAKind;
    }
    if (first === 3) {
      if (second === 2) {
        return HandResult.FullHouse;
      }
      return HandResult.ThreeOfAKind;
    }
    if (first === 2) {
      if (second === 2) {
        return HandResult.TwoPair;
      }
      return HandResult.Pair;
    }
    return HandResult.HighCard;
  }

  sort(other: Hand) {
    const a = Math.sign(this.value() - other.value());
    if (a === 0) {
      return this.compareHighCards(other);
    }
    return a;
  }

  compareHighCards(other: Hand) {
    for (let i = 0; i < this.cards.length; i++) {
      const a = CARD_VALUES.indexOf(this.cards[i])
      const b = CARD_VALUES.indexOf(other.cards[i])
      if (a !== b) {
        return Math.sign(a - b);
      }
    }
    return 0;
  }

  toString() {
    return `${this.cards.join('')} ${this.bid} ${this.value()}`;
  }
}

async function partOne() {
  const input = (await getInput()).map(x => {
    const [cards, bidString] = x.split(' ')
    return new Hand(cards, Number(bidString));
  });
  input.sort((a,b) => a.sort(b));
  const totalWinnings = input.reduce((acc, c, i) => acc + (i + 1) * c.bid, 0);
  console.log(totalWinnings)
}

async function partTwo() {
  const input = (await getInput()).map(Number);
}
  

partOne();