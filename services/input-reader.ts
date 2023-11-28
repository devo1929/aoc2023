import * as fs from 'fs';
import * as path from 'path';

const inputsPath = path.join(__dirname, '../inputs');
const samplesPath = path.join(inputsPath, `/samples`);
const mainModuleName = path.basename(require.main!.filename, '.ts');

export class InputReader {

    readInput(): Promise<string[]> {
        return this.readFile(path.join(inputsPath, `${mainModuleName}.txt`));
    }

    readSampleInput(): Promise<string[]> {
        return this.readFile(path.join(samplesPath, `${mainModuleName}.txt`));
    }

    private readFile(filePath: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf-8', (err, data) => {
                if (err)
                    return reject(err);

                return resolve(data.trim().split('\r\n'));
            });
        })
    }
}
