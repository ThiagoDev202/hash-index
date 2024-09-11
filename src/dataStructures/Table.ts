import Tuple from "./Tuple";

class Table {
    tuples: Tuple[]
    constructor() {
        this.tuples = [];
    }

    loadData(lines:string[]) {
        this.tuples = lines.map((line, index) => ({ key: line.trim(), data: { id: index } }));
    }
}

export default Table;
