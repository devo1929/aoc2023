import { InputReader } from '../services/input-reader';

const inputReader = new InputReader();
const partOneKeys = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].reduce((keys, val) => {
    keys[val] = val;
    return keys;
}, {});
const partTwoKeys = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'].reduce((keys, val, idx) => {
    keys[val] = idx;
    return keys;
}, {...partOneKeys});

/**
 * day1
 */
export function main(): void {
    inputReader.readInput().then(input => {
        partOne(input);
        partTwo(input);
    });
}

function partOne(input: string[]): void {
    const calibrationValues = input.map(i => findCalibrationValues(i, partOneKeys));
    const total = sum(calibrationValues);

    console.log(total);
}


function partTwo(input: string[]): void {
    const calibrationValues = input.map(i => findCalibrationValues(i, partTwoKeys));
    const total = sum(calibrationValues);

    console.log(total);
}

function sum(values: number[]): number {
    return values.reduce((sum, val) => sum + val, 0);
}

function findCalibrationValues(input: string, keys: any): number {
    const forwardValues = Object.keys(keys).map(key => ({
        key: key,
        index: input.indexOf(key)
    })).filter(k => k.index > -1).sort((a, b) => a.index > b.index ? 1 : -1);
    const reverseValues = Object.keys(keys).map(key => ({
        key: key,
        index: input.lastIndexOf(key)
    })).filter(k => k.index > -1).sort((a, b) => a.index > b.index ? -1 : 1);
    
    return parseInt(`${keys[forwardValues[0].key]}${keys[reverseValues[0].key]}`);
}

main();
