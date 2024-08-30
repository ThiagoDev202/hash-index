class Table {
    constructor() {
        this.tuples = [];
    }

    loadData(lines) {
        this.tuples = lines.map((line, index) => ({ key: line.trim(), data: { id: index + 1 } }));
    }
}

export default Table;
