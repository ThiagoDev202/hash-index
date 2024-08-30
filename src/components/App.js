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
  const [lines, setLines] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const linesPerPage = 10000;

  useEffect(() => {
    // Carregar o arquivo words.txt como default
    fetch(process.env.PUBLIC_URL + '/data/words.txt')
      .then(response => response.text())
      .then(text => {
        const allLines = text.split('\n');
        setLines(allLines);
        loadTable(allLines.slice(0, linesPerPage));
      })
      .catch(error => console.error('Erro ao carregar o arquivo words.txt:', error));
  }, []);

  const loadTable = (linesToLoad) => {
    const newTable = new Table();
    newTable.loadData(linesToLoad);
    setTable(newTable);
  };

  const handleSubmit = () => {
    if (table) {
      const newHashIndex = new HashIndex(table, pageSize, bucketSize, hashCount);
      setHashIndex(newHashIndex);
    }
  };

  const handleSearch = () => {
    if (hashIndex) {
      const result = hashIndex.search(searchKey);
      setSearchResult(result);
      setTableScanResult(null);
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
      setTableScanResult(scanResult);
    }
  };

  const loadMoreData = () => {
    const nextPage = currentPage + 1;
    const start = nextPage * linesPerPage;
    const end = start + linesPerPage;
    const newLines = lines.slice(start, end);
    loadTable(newLines);
    setCurrentPage(nextPage);
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

        {lines.length > (currentPage + 1) * linesPerPage && (
          <button onClick={loadMoreData}>Carregar Mais Dados</button>
        )}

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
