import Tuple from "./Tuple";

export interface Entry {
    pageSize: number;
    bucketSize: number;
    dataQuantity: number;
}

export interface Stats {
    pageQuantity: number;
    bucketQuantity: number;
}

export interface SearchResult {
    tuple: Tuple;
    page: number;
    cost: number;
}