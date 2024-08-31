import { Tuple } from './Tuple';

class Bucket {
    size: number;
    tuples: Tuple[];
    overflow: Bucket | null;

    constructor(size: number) {
        this.size = size;
        this.tuples = [];
        this.overflow = null;
    }

    addTuple(tuple: Tuple): void {
        if (this.tuples.length < this.size) {
            this.tuples.push(tuple);
        } else {
            if (!this.overflow) {
                this.overflow = new Bucket(this.size);
            }
            this.overflow.addTuple(tuple);
        }
    }

    findTuple(key: string): Tuple | null {
        for (const tuple of this.tuples) {
            if (tuple.key === key) {
                return tuple;
            }
        }
        if (this.overflow) {
            return this.overflow.findTuple(key);
        }
        return null;
    }
}

export default Bucket;
