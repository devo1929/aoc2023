import { InputReader } from '../services/input-reader';

console.log('this is testing ts-node');
const inputReader = new InputReader();

inputReader.readInput().then(content => {
    console.log('test day content:', content);
});

inputReader.readSampleInput().then(content => {
    console.log('test sample content:', content);
});
