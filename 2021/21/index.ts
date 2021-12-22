import { getInput } from '../../utils';
import { KeyVal } from '../../utils/types';

function deterministicDice() {
  let i = 0;
  const roll = function() {
    i = i + 1;
    return i % 100;
  }
  const totalRolls = () => i;
  return [roll, totalRolls];
}

type PlayerState = {
  id: number,
  position: number,
  score: number
};

class Game {
  private _currPlayer: PlayerState;
  private _nextPlayer: PlayerState;

  constructor(currPlayer: PlayerState, nextPlayer: PlayerState) {
    this._currPlayer = currPlayer;
    this._nextPlayer = nextPlayer;
  }
  next(diceSum: number): Game {
    return new Game(this._nextPlayer, nextPlayerState(this._currPlayer, diceSum));
  }

  hasWinner(scoreNeeded: number) {
    return this._currPlayer.score >= scoreNeeded || this._nextPlayer.score >= scoreNeeded;
  }

  getWinner():PlayerState {
    if (this._currPlayer.score > this._nextPlayer.score) {
      return this._currPlayer;
    }
    return this._nextPlayer;
  }

  toString() {
    return JSON.stringify(this);
  }

  get scores() {
    return [this._currPlayer.score, this._nextPlayer.score];
  }
}

function nextPlayerState(p: PlayerState, diceSum: number): PlayerState {
  const position = (p.position + diceSum) % 10;
  const score = p.score + position + 1;
  return {
    id: p.id,
    position,
    score
  }
}

async function partOne() {
  const input = await getInput();
  const players = getPlayers(input);

  const [roll, totalRolls] = deterministicDice();
  const rollThrice = () => roll() + roll() + roll();
  let game = new Game(players[0], players[1]);

  while (!game.hasWinner(1000)) {
    game = game.next(rollThrice());
  }

  console.log(Math.min(...game.scores) * totalRolls());
}

function getPlayers(input: string[]) {
  return input
    .map(x => Number(x.replace(/Player \d starting position: /, '')) - 1)
    .map<PlayerState>((position, i) => ({
      id: i + 1,
      position,
      score: 0
    }));
}

async function partTwo() {
  const input = await getInput();
  const players = getPlayers(input);

  const dice = [1, 2, 3];
  const allDiceOutcomes = dice.flatMap(x => dice.flatMap(y => dice.flatMap(z => x + y + z)));

  const cache: KeyVal<[number, number]> = {};

  function play(game: Game) : [number, number] {
    if (game.hasWinner(21)) {
      const p1Won = game.getWinner().id === 1;
      return p1Won ? [1, 0] : [0, 1];
    } 
    if (cache[game.toString()]) {
      return cache[game.toString()]
    }
    const outcome = allDiceOutcomes
      .map(d => play(game.next(d)))
      .reduce<[number, number]>((acc, curr) => {
        curr.forEach((c, i) => acc[i] += c);
        return acc;
      }, [0, 0]);
    cache[game.toString()] = outcome;
    return outcome;
  }

  const g = new Game(players[0], players[1]);
  const wins = play(g);
  console.log(Math.max(...wins));
}

partTwo();