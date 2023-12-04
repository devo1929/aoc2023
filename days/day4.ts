import { InputReader } from '../services/input-reader';

const inputReader = new InputReader();

/**
 * day4
 */
function main(): void {
    inputReader.readInput().then(input => {
        const cards = Card.fromInputs(input);
        partOne(cards);
        partTwo(cards);
    });
}

function partOne(cards: Card[]): void {
    const points = cards.map(c => c.points);
    console.log(sum(points));

}

function partTwo(cards: Card[]): void {
    const scoreCard = Card.score(cards);
    console.log(sum(Object.values(scoreCard)));

}

function sum(numbers: number[]): number {
    return numbers.reduce((sum, n) => sum + n, 0);
}

class Card {

    private static regex = /^Card\s+(\d+):\s+(.+)\s+\|\s+(.+)$/

    id: number;
    winningNumbers: number[] = [];
    plays: number[] = [];
    copies: Card[] = [];


    static fromInputs(inputs: string[]): Card[] {
        const cards = inputs.map(Card.fromString);
        Card.findCopies(cards);
        return cards;
    }

    static fromString(input: string): Card {
        const matches = Card.regex.exec(input);
        const card = new Card();
        card.id = parseInt(matches[1]);
        card.winningNumbers = matches[2].split(/\s+/).map(n => parseInt(n));
        card.plays = matches[3].split(/\s+/).map(n => parseInt(n));
        return card;
    }

    get matchingNumbers(): number[] {
        return this.plays.filter(p => this.winningNumbers.indexOf(p) > -1);
    }

    get points(): number {
        const matchingNumbers = this.matchingNumbers;
        if (!matchingNumbers.length)
            return 0;
        return matchingNumbers.slice(1).reduce((_sum) => _sum * 2, 1);
    }

    static findCopies(cards: Card[]): void {
        cards.forEach((card, idx) => {
            card.copies = cards.slice(++idx, idx + card.matchingNumbers.length);
        });
    }

    static score(cards: Card[], scoreCard: { [key: string]: number } = null): { [key: string]: number } {
        scoreCard = scoreCard || cards.reduce((dict, card) => {
            dict[card.id] = 0;
            return dict;
        }, {});
        
        cards.forEach(card => {
            scoreCard[card.id]++;
            Card.score(card.copies, scoreCard);
        });
        
        return scoreCard;
    }
}

main();
