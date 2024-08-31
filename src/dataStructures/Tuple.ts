export interface Data {
    id: number;
    name: string;
    // Outras propriedades...
}

export class Tuple {
    key: string;
    data: any; // Substitua `any` por um tipo mais específico se souber a estrutura dos dados

    constructor(key: string, data: any) {
        this.key = key;
        this.data = data;
    }
}

export default Tuple;
