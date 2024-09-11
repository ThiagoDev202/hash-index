class HashFunction {
    bucketCount: number
    prime: number

    constructor(bucketCount: number, prime: number = 31) {
        this.bucketCount = bucketCount;
        this.prime = prime
    }

    hash(key: string) {
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash = (hash * this.prime + key.charCodeAt(i)) % this.bucketCount;
        }
        return hash;
    }
}

export default HashFunction;