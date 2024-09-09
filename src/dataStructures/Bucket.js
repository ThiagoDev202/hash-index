class Bucket {
    constructor(size) {
        this.size = size;
        this.tuples = [];
        this.overflow = null;
    }

    addTuple(tuple) {
        if (this.tuples.length < this.size) {
            this.tuples.push(tuple);
        } else {
            if (!this.overflow) {
                this.overflow = new Bucket(this.size);
            }
            this.overflow.addTuple(tuple);
        }
    }

    findTuple(key, cost = 0) {
        for (const tuple of this.tuples) {
            cost++;
            if (tuple.key === key) {
                return {tuple,cost};
            }
        }
        if (this.overflow) {
            return this.overflow.findTuple(key,cost);
        }
        return null;
    }
}

export default Bucket;
