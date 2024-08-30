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
  const [stats, setStats] = useState({
    nrBuckets: 0,
    collisions: 0,
    overflows: 0,
    searchCost: 0,
    tableScanCost: 0,
  });

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
      calculateStats(newHashIndex);
    }
  };

  const calculateStats = (hashIndex) => {
    let collisions = 0;
    let overflows = 0;
    let totalAccess = 0;

    hashIndex.buckets.forEach(bucket => {
      totalAccess += bucket.tuples.length;
      if (bucket.overflow) {
        overflows++;
      }
      if (bucket.tuples.length > 1) {
        collisions += bucket.tuples.length - 1;
      }
    });

    setStats({
      nrBuckets: hashIndex.buckets.length,
      collisions: collisions,
      overflows: overflows,
      searchCost: totalAccess,
      tableScanCost: hashIndex.pages.length,
    });
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
            <table>
              <thead>
                <tr>
                  <th>Index</th>
                  <th>Name</th>
                  <th>Page</th>
                </tr>
              </thead>
              <tbody>
                {tableScanResult.map((tuple, index) => (
                  <tr key={index}>
                    <td>{index}</td>
                    <td>{tuple.key}</td>
                    <td>{Math.floor(index / pageSize)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {lines.length > (currentPage + 1) * linesPerPage && (
          <button onClick={loadMoreData}>Carregar Mais Dados</button>
        )}

        {hashIndex && (
          <div>
            <h2>Estrutura Hash</h2>
            <table>
              <thead>
                <tr>
                  <th>Index</th>
                  <th>Name</th>
                  <th>Page</th>
                </tr>
              </thead>
              <tbody>
                {hashIndex.pages.map((page, pageIndex) =>
                  page.tuples.map((tuple, tupleIndex) => (
                    <tr key={`${pageIndex}-${tupleIndex}`}>
                      <td>{tupleIndex + pageIndex * pageSize}</td>
                      <td>{tuple.key}</td>
                      <td>{pageIndex}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <h3>Estatísticas</h3>
            <ul>
              <li>Número de Buckets: {stats.nrBuckets}</li>
              <li>Colisões: {stats.collisions}</li>
              <li>Overflows: {stats.overflows}</li>
              <li>Estimativa de Custo de Busca: {stats.searchCost}</li>
              <li>Estimativa de Custo de Table Scan: {stats.tableScanCost}</li>
            </ul>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
