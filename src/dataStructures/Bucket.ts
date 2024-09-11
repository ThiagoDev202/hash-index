import Tuple from "./Tuple";
import { SearchResult } from "./Types";


interface AddTupleResult {
    collision : boolean; 
    overflow : boolean;
}

interface BucketSlot {
    tuple: Tuple;
    page: number;
}

class Bucket {
    size: number
    slots: BucketSlot[]
    overflow: Bucket | null

    constructor(size: number) {
        this.size = size;
        this.slots = [];
        this.overflow = null;
    }

    addTuple(tuple: Tuple, page: number): AddTupleResult {
        let collision = this.slots.length > 0;
        let overflow = false;

        if (this.slots.length < this.size) {
            this.slots.push({tuple,page});

        } else {
            if (!this.overflow) {
                this.overflow = new Bucket(this.size);
                overflow = true
            }
            let result = this.overflow.addTuple(tuple,page);
            overflow ||= result.overflow  
        }

        return {collision, overflow}
    }

    findTuple(key: string): SearchResult | null {
        for (const slot of this.slots) {
            if (slot.tuple.key === key) {
                return { tuple: slot.tuple, page: slot.page, cost: 1 };
            }
        }
        if (this.overflow) {
            return this.overflow.findTuple(key);
        }
        return null;
    }
}

export default Bucket;
