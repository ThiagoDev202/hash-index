import { promises as fs } from 'fs';


export const getTuples = async (): Promise<string[]> => {
    let lines: string[] = []

    const file = await fs.readFile('/public/words.txt')

    lines = file.toString().split('\n')

    // await fsPromise.open('/public/words.txt', 'r').then(async file => {
    //     for await (const line of file.readLines()) {
    //         console.log(line);
    //         lines.push(line)
    //     }
    // });

    return lines
}