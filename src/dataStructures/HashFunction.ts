class HashFunction {
    bucketCount: number;

    constructor(bucketCount: number) {
        this.bucketCount = bucketCount;
    }

    hash(key: string): number {
        // Simples função hash baseada na soma dos valores dos caracteres
        let hashValue = 0;
        for (let i = 0; i < key.length; i++) {
            hashValue += key.charCodeAt(i);
        }
        return hashValue % this.bucketCount;
    }
}

export default HashFunction;
