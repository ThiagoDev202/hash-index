import Page from './Page';
import Bucket from './Bucket';
import HashFunction from './HashFunction';

class HashIndex {
    constructor(table, pageSize, bucketSize, hashCount) {
        this.table = table;
        this.pages = [];
        this.buckets = [];
        this.hashFunction = new HashFunction(hashCount);

        // Criar páginas
        let currentPage = new Page(pageSize);
        for (const tuple of table.tuples) {
            if (!currentPage.addTuple(tuple)) {
                this.pages.push(currentPage);
                currentPage = new Page(pageSize);
                currentPage.addTuple(tuple);
            }
        }
        this.pages.push(currentPage);

        // Criar buckets
        for (let i = 0; i < this.hashFunction.bucketCount; i++) {
            this.buckets[i] = new Bucket(bucketSize);
        }

        // Mapear tuplas nos buckets
        for (const page of this.pages) {
            for (const tuple of page.tuples) {
                const bucketIndex = this.hashFunction.hash(tuple.key);
                this.buckets[bucketIndex].addTuple(tuple);
            }
        }
    }

    search(key) {
        const bucketIndex = this.hashFunction.hash(key);
        return this.buckets[bucketIndex].findTuple(key);
    }
}

export default HashIndex;
