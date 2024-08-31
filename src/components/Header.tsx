import React from 'react';

interface Props {
  pageSize: number;
  setPageSize: (size: number) => void;
  bucketSize: number;
  setBucketSize: (size: number) => void;
  hashCount: number;
  setHashCount: (count: number) => void;
  handleSubmit: () => void;
  searchKey: string;
  setSearchKey: (key: string) => void;
  handleSearch: () => void;
  handleTableScan: () => void;
}

const Header: React.FC<Props> = ({
  pageSize,
  setPageSize,
  bucketSize,
  setBucketSize,
  hashCount,
  setHashCount,
  handleSubmit,
  searchKey,
  setSearchKey,
  handleSearch,
  handleTableScan,
}) => (
  <header className="App-header">
    <h1>Índice Hash</h1>
    <div className="input-group">
      <div className="input-label">
        <label htmlFor="pageSize">Tamanho da Página:</label>
        <input
          id="pageSize"
          type="number"
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="input-field"
        />
      </div>
      <div className="input-label">
        <label htmlFor="bucketSize">Tamanho do Bucket:</label>
        <input
          id="bucketSize"
          type="number"
          value={bucketSize}
          onChange={(e) => setBucketSize(Number(e.target.value))}
          className="input-field"
        />
      </div>
      <div className="input-label">
        <label htmlFor="hashCount">Número de Hashes:</label>
        <input
          id="hashCount"
          type="number"
          value={hashCount}
          onChange={(e) => setHashCount(Number(e.target.value))}
          className="input-field"
        />
      </div>
      <button onClick={handleSubmit} className="btn-primary">
        Criar Estrutura Hash
      </button>
    </div>

    <div className="search-group">
      <input
        type="text"
        value={searchKey}
        onChange={(e) => setSearchKey(e.target.value)}
        placeholder="Digite a chave de busca"
        className="input-field"
      />
      <button onClick={handleSearch} className="btn-primary">
        Buscar
      </button>
      <button onClick={handleTableScan} className="btn-secondary">
        Scan da Tabela
      </button>
    </div>
  </header>
);

export default Header;
