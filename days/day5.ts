import { InputReader } from '../services/input-reader';

const inputReader = new InputReader();

/**
 * day5
 */
function main(): void {
    inputReader.readInput().then(input => {
        const mapList = new MapList(input);
        partOne(mapList);
        partTwo(mapList);
    });
}

function partOne(mapList: MapList): void {
    const lowestLocation = mapList.findNearestLocationForSeeds();
    console.log(lowestLocation);
}

function partTwo(mapList: MapList): void {
    const lowestLocation = mapList.findNearestLocationForSeedRanges();
    console.log(lowestLocation);
}

class MapList {
    public static mapNameRegex: RegExp = /(\w+)-to-(\w+)\s+map:/;
    public static rangesRegex: RegExp = /(\d+)\s+(\d+)\s+(\d+)/;
    public static seedListRegex: RegExp = /seeds:\s+([\d\s]+)/;

    private _seedRanges: SeedRange[];
    seeds: number[] = [];
    maps: Map[] = [];

    constructor(inputs: string[]) {
        this.load(inputs);
    }

    findNearestLocationForSeeds(): number {
        let minLocation = Infinity;
        this.seeds.forEach(seed => {
            const location = this.findDestinationValue(seed);
            if (location < minLocation)
                minLocation = location;
        })
        return minLocation;
    }

    findNearestLocationForSeedRanges(): number {
        let minLocation = Infinity;
        this.seedRanges.forEach(seedPair => {
            for (let seed = seedPair.start; seed < seedPair.start + seedPair.length; seed++) {
                const location = this.findDestinationValue(seed);
                if (location < minLocation)
                    minLocation = location;
            }
        })
        return minLocation;
    }

    private findDestinationValue(value: number, srcType: SourceDestinationType = SourceDestinationType.seed, destType: SourceDestinationType = SourceDestinationType.location): number {
        const map = this.maps.find(m => m.source === srcType);
        if (!map)
            throw new Error(`Could not find map for type: ${srcType}`);

        const mappingValue = map.getMapping(value);
        if (map.destination === destType)
            return mappingValue;

        return this.findDestinationValue(mappingValue, map.destination, destType);
    }

    get seedRanges(): SeedRange[] {
        if (!this._seedRanges) {
            this._seedRanges = [];
            for (let i = 0; i < this.seeds.length; i += 2) {
                this._seedRanges.push(new SeedRange(this.seeds[i], this.seeds[i + 1]));
            }
        }
        return this._seedRanges;
    }

    private load(inputs: string[]): void {
        if (!inputs.length)
            throw new Error('no inputs');
        inputs = inputs.filter(line => !!line); // filter empty lines

        this.loadSeeds(inputs[0]);
        this.loadMaps(inputs.slice(1));
    }

    private loadSeeds(line: string): void {
        const seedListMatch = MapList.seedListRegex.exec(line);
        if (seedListMatch === null)
            throw new Error('seed list regex mismatch');

        this.seeds = seedListMatch[1].split(/\s+/).map(m => parseInt(m));
    }

    private loadMaps(lines: string[]): void {
        for (let i = 0; i < lines.length; i++) {
            const mapNameMatch = MapList.mapNameRegex.exec(lines[i]);
            if (mapNameMatch !== null)
                i = this.loadMap(mapNameMatch.slice(1), lines, i + 1);
        }
    }

    private loadMap(nameParts: string[], lines: string[], startingLineIdx: number): number {
        const map = new Map();
        map.source = MapList.getSrcDesType(nameParts[0]);
        map.destination = MapList.getSrcDesType(nameParts[1]);
        for (let i = startingLineIdx; i < lines.length; i++) {
            const rangesMatch = MapList.rangesRegex.exec(lines[i]);
            if (rangesMatch === null) {
                this.maps.push(map);
                return i - 1;
            }
            map.ranges.push(new Range(parseInt(rangesMatch[1]), parseInt(rangesMatch[2]), parseInt(rangesMatch[3])))
        }
        this.maps.push(map);
        return Infinity;
    }

    private static getSrcDesType(input: string): SourceDestinationType {
        switch (input) {
            case 'seed':
                return SourceDestinationType.seed;
            case 'soil':
                return SourceDestinationType.soil;
            case 'fertilizer':
                return SourceDestinationType.fertilizer;
            case 'water':
                return SourceDestinationType.water;
            case 'light':
                return SourceDestinationType.light;
            case 'temperature':
                return SourceDestinationType.temperature;
            case 'humidity':
                return SourceDestinationType.humidity;
            case 'location':
                return SourceDestinationType.location;
            default:
                throw new Error(`unknown src/dest type ${input}`);

        }
    }
}

class Map {
    source: SourceDestinationType;
    destination: SourceDestinationType;
    ranges: Range[] = [];

    getMapping(source: number): number {
        const range = this.ranges.find(r => r.contains(source));
        return range?.getDestination(source) || source;
    }
}

class Range {
    sourceStart: number;
    destinationStart: number;
    length: number;

    constructor(destination: number, start: number, length: number) {
        this.destinationStart = destination;
        this.sourceStart = start;
        this.length = length;
    }

    contains(source: number): boolean {
        return this.sourceStart <= source && this.sourceStart + this.length > source;
    }

    getDestination(source: number): number {
        return this.destinationStart + (source - this.sourceStart);
    }
}

class SeedRange {
    start: number;
    length: number;

    constructor(start: number, length: number) {
        this.start = start;
        this.length = length;
    }
}

enum SourceDestinationType {
    seed = 1,
    soil = 2,
    fertilizer = 3,
    water = 4,
    light = 5,
    temperature = 6,
    humidity = 7,
    location = 8
}

main();
