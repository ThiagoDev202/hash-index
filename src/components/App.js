import React, { useState, useEffect } from 'react';
import { HashIndex, Table } from '../dataStructures';
import '../styles/App.css';

function App() {
  const [table, setTable] = useState(null);
  const [hashIndex, setHashIndex] = useState(null);
  const [searchKey, setSearchKey] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [tableScanResult, setTableScanResult] = useState(null);
  const [pageSize, setPageSize] = useState(100);
  const [bucketSize, setBucketSize] = useState(10);
  const [hashCount, setHashCount] = useState(10);

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/data/words.txt')
      .then(response => response.text())
      .then(text => {
        const lines = text.split('\n').slice(0, 10000); // Limite o número de linhas carregadas
        const newTable = new Table();
        newTable.loadData(lines);
        console.log("Tabela carregada com", lines.length, "linhas");
        setTable(newTable);
      })
      .catch(error => console.error('Erro ao carregar o arquivo words.txt:', error));
  }, []);
  

  const handleSubmit = () => {
    if (table) {
      const newHashIndex = new HashIndex(table, pageSize, bucketSize, hashCount);
      console.log(newHashIndex); // Verificar a estrutura do hash criada
      setHashIndex(newHashIndex);
    } else {
      console.log('Tabela não carregada corretamente');
    }
  };
  

  const handleSearch = () => {
    if (hashIndex) {
      const result = hashIndex.search(searchKey);
      setSearchResult(result);
      setTableScanResult(null); // Limpar resultado do table scan ao fazer nova busca
    }
  };

  const handleTableScan = () => {
    if (table) {
      let scanResult = [];
      for (let page of hashIndex.pages) {
        for (let tuple of page.tuples) {
          scanResult.push(tuple);
          if (tuple.key === searchKey) {
            setTableScanResult(scanResult);
            return;
          }
        }
      }
      setTableScanResult(scanResult); // Retorna todos os dados se a chave não for encontrada
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Índice Hash</h1>
        <div>
          <label>
            Tamanho da Página:
            <input
              type="number"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            />
          </label>
          <label>
            Tamanho do Bucket:
            <input
              type="number"
              value={bucketSize}
              onChange={(e) => setBucketSize(Number(e.target.value))}
            />
          </label>
          <label>
            Número de Hashes:
            <input
              type="number"
              value={hashCount}
              onChange={(e) => setHashCount(Number(e.target.value))}
            />
          </label>
          <button onClick={handleSubmit}>Criar Estrutura Hash</button>
        </div>

        <input
          type="text"
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          placeholder="Digite a chave de busca"
        />
        <button onClick={handleSearch}>Buscar</button>
        {searchResult && (
          <div>
            <h2>Resultado da Busca:</h2>
            {searchResult ? (
              <div>
                <p>Chave: {searchResult.key}</p>
                <p>Dados: {JSON.stringify(searchResult.data)}</p>
              </div>
            ) : (
              <p>Chave não encontrada.</p>
            )}
          </div>
        )}
        <button onClick={handleTableScan}>Table Scan</button>
        {tableScanResult && (
          <div>
            <h2>Resultado do Table Scan:</h2>
            <ul>
              {tableScanResult.map((tuple, index) => (
                <li key={index}>
                  Chave: {tuple.key}, Dados: {JSON.stringify(tuple.data)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Exibição da estrutura do Hash */}
        {hashIndex && (
          <div>
            <h2>Estrutura Hash</h2>
            <div>
              <h3>Páginas</h3>
              {hashIndex.pages.map((page, index) => (
                <div key={index}>
                  <h4>Página {index + 1}</h4>
                  <ul>
                    {page.tuples.map((tuple, idx) => (
                      <li key={idx}>
                        Chave: {tuple.key}, Dados: {JSON.stringify(tuple.data)}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div>
              <h3>Buckets</h3>
              {hashIndex.buckets.map((bucket, index) => (
                <div key={index}>
                  <h4>Bucket {index + 1}</h4>
                  <ul>
                    {bucket.tuples.map((tuple, idx) => (
                      <li key={idx}>
                        Chave: {tuple.key}, Dados: {JSON.stringify(tuple.data)}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
