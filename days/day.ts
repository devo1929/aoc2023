import * as child_process from 'child_process';
import * as readline from 'readline';

if (process.argv.length > 2)
    executeDay(process.argv[2]);
else
    promptForDay();

function promptForDay(): void {
    const _readline = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    _readline.question('What day are you running? ', day => {
        _readline.close();
        console.log(`Running day ${day}...`);
        executeDay(day);
    });
}

function executeDay(day: string): void {
    child_process.exec(`ts-node days/day${day}.ts`, (err, stdout) => {
        console.log(stdout);
    });
}


