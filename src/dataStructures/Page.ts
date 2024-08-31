import Tuple from './Tuple';

class Page {
    size: number;
    tuples: Tuple[];

    constructor(size: number) {
        this.size = size;
        this.tuples = [];
    }

    addTuple(tuple: Tuple): boolean {
        if (this.tuples.length < this.size) {
            this.tuples.push(tuple);
            return true;
        }
        return false;
    }
}

export default Page;
