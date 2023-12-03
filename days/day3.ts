import { InputReader } from '../services/input-reader';

const inputReader = new InputReader();

/**
 * day3
 */
function main(): void {
    inputReader.readInput().then(input => {
        const engine = new Engine(input);
        partOne(engine);
        partTwo(engine);
    });
}

function partOne(engine: Engine): void {
    const parts = engine.parts;
    const values = parts.map(pn => pn.value);
    console.log(sum(values));
}

function partTwo(engine: Engine): void {
    const gears = engine.gears;
    const gearRatios = gears.map(pn => pn.gearRatio);
    console.log(sum(gearRatios));
}

function sum(numbers: number[]): number {
    return numbers.reduce((sum, num) => sum + num, 0);
}

function uniqueHashes(schematicEntry: SchematicEntry, index: number, schematicEntries: SchematicEntry[]): boolean {
    return schematicEntries.findIndex(se => se.hash === schematicEntry.hash) === index;
}

class Engine {
    schematicEntries: SchematicEntry[][];

    constructor(lines: string[]) {
        this.schematicEntries = [];
        lines.forEach(line => {
            this.loadSchematicEntries(line);
        });
        this.findAdjacentEntries();
        this.findInfo();
    }

    get parts(): SchematicEntry[] {
        return this.schematicEntries
            .map(ses => ses.filter(uniqueHashes)) // unique ids across each row
            .flat()
            .filter(se => se.isPart);
    }

    get gears(): SchematicEntry[] {
        return this.schematicEntries
            .flat()
            .filter(se => se.isGear);
    }

    private loadSchematicEntries(line: string): void {
        const chars = line.split('');
        const y = this.schematicEntries.length;
        const schematicEntries = []
        for (let x = 0; x < chars.length; x++)
            schematicEntries.push(new SchematicEntry(x, y, chars[x]));
        this.schematicEntries.push(schematicEntries);
    }

    private findInfo(): void {
        this.schematicEntries.flat().forEach(schematicEntry => {
            schematicEntry.findInfo();
        });
    }

    private findAdjacentEntries(): void {
        this.schematicEntries.flat().forEach(schematicEntry => {
            for (let x = schematicEntry.x - 1; x <= schematicEntry.x + 1; x++) {
                for (let y = schematicEntry.y - 1; y <= schematicEntry.y + 1; y++) {
                    if (this.isInAdjacentBounds(x, y, schematicEntry))
                        schematicEntry.addAdjacent(this.schematicEntries[y][x]);
                }
            }
        });
    }

    private isInAdjacentBounds(x: number, y: number, schematicEntry: SchematicEntry): boolean {
        if (x < 0 || y < 0 || y === this.schematicEntries.length || x === this.schematicEntries[y].length)
            return false;
        return x !== schematicEntry.x || y !== schematicEntry.y;
    }
}

class SchematicEntry {
    x: number;
    y: number;
    hash: string;
    value: number;
    char: string;
    private numberEntries: SchematicEntry[];
    private adjacentEntries: SchematicEntry[];
    private adjacentParts: SchematicEntry[];
    private hasAdjacentSymbol: boolean;

    constructor(x: number, y: number, char: string) {
        this.x = x;
        this.y = y;
        this.char = char;
        this.numberEntries = [];
        this.adjacentEntries = [];
    }

    findInfo(): void {
        if (!this.isNumber)
            return;
        this.numberEntries = this.getNumberEntries();
        const stringValue = this.numberEntries
            .map(se => se.char)
            .reduce((id, char) => id + char, '');
        this.value = parseInt(stringValue);
        this.hash = this.numberEntries[0].x.toString() + stringValue;
        this.hasAdjacentSymbol = !!this.numberEntries.find(ne => ne.adjacentEntries.find(ae => ae.char !== '.' && !ae.isNumber));
    }

    get isGear(): boolean {
        return this.char === '*' && this.getAdjacentParts()
            .filter(uniqueHashes).length === 2;
    }

    get gearRatio(): number {
        return this.getAdjacentParts().map(p => p.value).reduce((ratio, value) => ratio * value,  1);
    }


    get number(): number {
        return parseInt(this.char);
    }

    get isNumber(): boolean {
        return Number.isFinite(this.number);
    }

    get isPart(): boolean {
        return this.hasAdjacentSymbol;
    }

    public addAdjacent(schematicEntry: SchematicEntry): void {
        this.adjacentEntries.push(schematicEntry);
    }

    private getAdjacentParts(): SchematicEntry[] {
        if (!this.adjacentParts)
            this.adjacentParts = this.adjacentEntries
                .filter(ae => ae.isPart)
                .filter(uniqueHashes);
        return this.adjacentParts;
    }

    private getLeftAdjacentNumbers(): SchematicEntry[] {
        const leftAdjacent = this.getLeftAdjacentNumber();
        return leftAdjacent ? [leftAdjacent, ...leftAdjacent.getLeftAdjacentNumbers()] : [];
    }

    private getRightAdjacentNumbers(): SchematicEntry[] {
        const rightAdjacent = this.getRightAdjacentNumber();
        return rightAdjacent ? [rightAdjacent, ...rightAdjacent.getRightAdjacentNumbers()] : [];
    }

    private getLeftAdjacentNumber(): SchematicEntry {
        return this.adjacentEntries.find(e => e.x === this.x - 1 && e.y === this.y && e.isNumber);
    }

    private getRightAdjacentNumber(): SchematicEntry {
        return this.adjacentEntries.find(e => e.x === this.x + 1 && e.y === this.y && e.isNumber);
    }

    private getNumberEntries(): SchematicEntry[] {
        return [...this.getLeftAdjacentNumbers().reverse(), this, ...this.getRightAdjacentNumbers()];
    }
}

main();
