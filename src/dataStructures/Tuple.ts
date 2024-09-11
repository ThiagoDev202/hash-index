
class Tuple {
    key: string;
    data: any;

    constructor(key: any, data: any) {
        this.key = key; // Chave de busca
        this.data = data; // Dados da linha
    }
}

export default Tuple;