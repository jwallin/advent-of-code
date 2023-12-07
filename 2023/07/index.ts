import { getInput } from '../../utils';

const CARD_VALUES = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'].reverse();
const CARD_VALUES_WITH_JOKER = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'].reverse();

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
  cardValues: string[];
  hasJoker: boolean;

  constructor(cards: string, bid: number, hasJoker = false) {
    this.cards = cards.split('');
    this.bid = bid;

    this.hasJoker = hasJoker;
    this.cardValues = hasJoker ? CARD_VALUES_WITH_JOKER : CARD_VALUES;
  }

  countInstances() {
    const seenCards = this.cards.filter(x => !this.hasJoker || x !== 'J').reduce((acc, x) => {
      const cardCount = acc.get(x);
      if (cardCount === undefined) {
        acc.set(x, 1);
      } else {
        acc.set(x, cardCount + 1);
      }
      return acc;
    }, new Map<string, number>());

    const instances = [...seenCards.values()];
    while (instances.length < 2) {
      instances.push(0);
    }
    
    return instances.sort().reverse();
  }

  countJokers() {
    if (!this.hasJoker) {
      return 0;
    }
    return this.cards.filter(x => x === 'J').length
  }

  value() {
    const [first, second] = this.countInstances();
    const jokers = this.countJokers();
    if (first + jokers > 4) {
      return HandResult.FiveOfAKind;
    }
    if (first + jokers === 4) {
      return HandResult.FourOfAKind;
    }
    if (first + jokers === 3) {
      if (second === 2) {
        return HandResult.FullHouse;
      }
      return HandResult.ThreeOfAKind;
    }
    if (first + jokers === 2) {
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
      const a = this.cardValues.indexOf(this.cards[i])
      const b = this.cardValues.indexOf(other.cards[i])
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

async function calcWinnings(hasJoker = false) {
  const input = (await getInput()).map(x => {
    const [cards, bidString] = x.split(' ');
    return new Hand(cards, Number(bidString), hasJoker);
  });

  input.sort((a, b) => a.sort(b));
  return input.reduce((acc, c, i) => acc + (i + 1) * c.bid, 0);
}

async function partOne() {
  const totalWinnings = await calcWinnings(false);
  console.log(totalWinnings);
}

async function partTwo() {
  const totalWinnings = await calcWinnings(true);
  console.log(totalWinnings);
}

partOne();
partTwo();