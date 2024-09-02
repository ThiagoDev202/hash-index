class Table {
    constructor() {
        this.tuples = [];
    }

    loadData(lines) {
        this.tuples = lines.map((line, index) => ({ key: line.trim(), data: { id: index } }));
    }
}

export default Table;
