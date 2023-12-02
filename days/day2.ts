import { InputReader } from '../services/input-reader';

const inputReader = new InputReader();

/**
 * day2.ts
 */
export function main(): void {
    inputReader.readInput().then(input => {
        const games = input.map(input => new Game(input));
        partOne(games);
        partTwo(games);
    });
}

function partOne(games: Game[]): void {
    const maxRed = 12, maxGreen = 13, maxBlue = 14;
    const possibleGames = games.filter(g => g.isPossible(maxRed, maxGreen, maxBlue));
    const gameIds = possibleGames.map(g => g.id);
    console.log(sum(gameIds));
}

function partTwo(games: Game[]): void {
    const minimumGameSets = games.map(g => g.minimumGameSet);
    const powers = minimumGameSets.map(mgs => mgs.power);
    console.log(sum(powers));
}

function sum(numbers: number[]): number {
    return numbers.reduce((sum, num) => sum + num, 0);
}

main();

class Game {
    private inputRegex: RegExp = /Game (\d+):\s(.+)/;
    id: number;
    gameSets: GameSet[];

    constructor(input: string) {
        const matches = this.inputRegex.exec(input);
        this.id = parseInt(matches[1]);
        const rawSets = matches[2].split(';').map(m => m.trim());
        this.gameSets = rawSets.map(rawSet => new GameSet(rawSet));
    }

    isPossible(maxRed: number, maxGreen: number, maxBlue: number): boolean {
        return this.gameSets.filter(gs => gs.isPossible(maxRed, maxGreen, maxBlue)).length === this.gameSets.length;
    }

    get minimumGameSet(): GameSet {
        const gameSet = new GameSet();
        this.gameSets.forEach(_gameSet => {
            if (_gameSet.red > gameSet.red)
                gameSet.red = _gameSet.red;
            if (_gameSet.green > gameSet.green)
                gameSet.green = _gameSet.green;
            if (_gameSet.blue > gameSet.blue)
                gameSet.blue = _gameSet.blue;
        });
        return gameSet;
    }
}

class GameSet {
    private inputRegex: RegExp = /(\d+)\s(\w+)/;
    red: number = 0;
    blue: number = 0;
    green: number = 0;

    constructor(input?: string) {
        const rawCubes = input?.split(',').map(i => i.trim()) || [];
        rawCubes.forEach(rawCube => {
            const matches = this.inputRegex.exec(rawCube);
            this[matches[2]] = parseInt(matches[1]);
        });
    }

    get power(): number {
        return this.red * this.green * this.blue;
    }

    isPossible(maxRed: number, maxGreen: number, maxBlue: number): boolean {
        return this.red <= maxRed && this.green <= maxGreen && this.blue <= maxBlue;
    }
}
