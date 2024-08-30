class Page {
    constructor(size) {
        this.size = size;
        this.tuples = [];
    }

    addTuple(tuple) {
        if (this.tuples.length < this.size) {
            this.tuples.push(tuple);
            return true;
        }
        return false;
    }
}

export default Page;
