import { InputReader } from '../services/input-reader';

const inputReader = new InputReader();

/**
 * day6
 */
function main(): void {
    inputReader.readInput().then(input => {
        partOne(input);
        partTwo(input);
    });
}

function partOne(input: string[]): void {
    const winningDistanceCounts = RaceList.fromRaces(input).winningDistanceCounts;
    console.log(multiply(winningDistanceCounts));
}

function partTwo(input: string[]): void {
    const winningDistanceCounts = RaceList.fromRaces(input, true).winningDistanceCounts;
    console.log(multiply(winningDistanceCounts));
}

function multiply(values: number[]): number {
    return values.reduce((multiplied, val) => multiplied * val, 1);
}

class RaceList {
    private static regex = /^(Time|Distance):\s+(.*)$/
    races: Race[];

    constructor() {
    }

    loadRaces(times: string[], distances: string[]): void {
        this.races = [];
        for (let i = 0; i < times.length; i++) {
            this.races.push(new Race(parseInt(times[i]), parseInt(distances[i])));
        }
    }

    static fromRaces(inputs: string[], combine: boolean = false): RaceList {
        const timeMatches = RaceList.regex.exec(inputs[0]);
        let timeValues = timeMatches[2].split(/\s+/);

        const distanceMatches = RaceList.regex.exec(inputs[1]);
        let distanceValues = distanceMatches[2].split(/\s+/);

        if (combine) {
            timeValues = [timeValues.join('')];
            distanceValues = [distanceValues.join('')];
        }
        const raceList = new RaceList();
        raceList.loadRaces(timeValues, distanceValues);
        return raceList;
    }

    get winningDistanceCounts(): number[] {
        return this.races.map(r => r.winningDistanceCount);
    }
}

class Race {
    time: number;
    distance: number;

    constructor(time: number, distance: number) {
        this.time = time;
        this.distance = distance;
    }

    get winningDistances(): number[] {
        const distances = [];
        for (let holdTime = 0; holdTime < this.time; holdTime++) {
            const raceTime = this.time - holdTime;
            const distance = raceTime * holdTime;
            if (distance > this.distance)
                distances.push(distance);
        }
        return distances;
    }

    get winningDistanceCount(): number {
        return this.winningDistances.length;
    }
}

main();
