import { Tuple } from './Tuple'; // Certifique-se de que Tuple está importado corretamente

class Table {
    tuples: Tuple[];

    constructor() {
        this.tuples = [];
    }

    loadData(lines: string[]): void {
        this.tuples = lines.map((line, index) => ({
            key: line.trim(),
            data: { id: index + 1 },
        }));
    }
}

export default Table;
