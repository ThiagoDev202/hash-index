import Page from './Page';
import Bucket from './Bucket';
import HashFunction from './HashFunction';
import Table from './Table';
import { Entry, Stats } from './Types';

class HashIndex {
    pages: Page[];
    buckets: Bucket[];
    hashFunction: HashFunction;
    collisions: number;
    overflows: number;

    constructor(table: Table, entry: Entry, stats: Stats) {
        this.pages = [];
        this.buckets = [];
        this.hashFunction = new HashFunction(stats.bucketQuantity);
        this.collisions = 0;
        this.overflows = 0;

        // Criar páginas
        let currentPage = new Page(entry.pageSize);
        for (const tuple of table.tuples) {
            if (!currentPage.addTuple(tuple)) {
                this.pages.push(currentPage);
                currentPage = new Page(entry.pageSize);
                currentPage.addTuple(tuple);
            }
        }
        this.pages.push(currentPage);

        // Criar buckets
        for (let i = 0; i < stats.bucketQuantity; i++) {
            this.buckets[i] = new Bucket(entry.bucketSize);
        }

        // Mapear tuplas nos buckets
        this.pages.forEach((page, index) => {
            for (const tuple of page.tuples) {
                const bucketIndex = this.hashFunction.hash(tuple.key);
                let { collision, overflow } = this.buckets[bucketIndex].addTuple(tuple, index);
                collision && this.collisions++
                overflow && this.overflows++
            }
        })
    }

    search(key: string) {
        const bucketIndex = this.hashFunction.hash(key);
        return this.buckets[bucketIndex].findTuple(key);
    }
}

export default HashIndex;
