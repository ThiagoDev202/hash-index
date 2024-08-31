import React, { useState, useEffect } from 'react';
import { HashIndex, Table } from '../dataStructures';
import Header from './Header';
import SearchResult from './SearchResult';
import TableScanResult from './TableScanResult';
import HashIndexTable from './HashIndexTable';
import '../styles/App.css';

const App: React.FC = () => {
  const [table, setTable] = useState<Table | null>(null);
  const [hashIndex, setHashIndex] = useState<HashIndex | null>(null);
  const [searchKey, setSearchKey] = useState<string>('');
  const [searchResult, setSearchResult] = useState<{ key: string; data: unknown } | null>(null);
  const [tableScanResult, setTableScanResult] = useState<{ key: string; data: unknown }[] | null>(null);
  const [pageSize, setPageSize] = useState<number>(100);
  const [bucketSize, setBucketSize] = useState<number>(10);
  const [hashCount, setHashCount] = useState<number>(10);
  const [lines, setLines] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const linesPerPage = 10000;
  const [stats, setStats] = useState({
    nrBuckets: 0,
    collisions: 0,
    overflows: 0,
    searchCost: 0,
    tableScanCost: 0,
  });

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/data/words.txt')
      .then(response => response.text())
      .then(text => {
        const allLines = text.split('\n').filter(line => line.trim() !== '');
        setLines(allLines);
        loadTable(allLines.slice(0, linesPerPage));
      })
      .catch(error => console.error('Erro ao carregar o arquivo words.txt:', error));
  }, []);

  const loadTable = (linesToLoad: string[]): void => {
    const newTable = new Table();
    newTable.loadData(linesToLoad);
    setTable(newTable);
  };

  const handleSubmit = (): void => {
    if (table) {
      const newHashIndex = new HashIndex(table, pageSize, bucketSize, hashCount);
      setHashIndex(newHashIndex);
      calculateStats(newHashIndex);
    }
  };

  const calculateStats = (hashIndex: HashIndex): void => {
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
      collisions,
      overflows,
      searchCost: totalAccess,
      tableScanCost: hashIndex.pages.length,
    });
  };

  const handleSearch = (): void => {
    if (hashIndex) {
      const result = hashIndex.search(searchKey);
      setSearchResult(result);
      setTableScanResult(null);
    }
  };

  const handleTableScan = (): void => {
    if (table && hashIndex) {
      const scanResult: { key: string; data: unknown }[] = [];
      for (const page of hashIndex.pages) {
        for (const tuple of page.tuples) {
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

  const loadMoreData = (): void => {
    const nextPage = currentPage + 1;
    const start = nextPage * linesPerPage;
    const end = start + linesPerPage;
    const newLines = lines.slice(start, end);
    loadTable(newLines);
    setCurrentPage(nextPage);
  };

  return (
    <div className="App">
      <Header
        pageSize={pageSize}
        setPageSize={setPageSize}
        bucketSize={bucketSize}
        setBucketSize={setBucketSize}
        hashCount={hashCount}
        setHashCount={setHashCount}
        handleSubmit={handleSubmit}
        searchKey={searchKey}
        setSearchKey={setSearchKey}
        handleSearch={handleSearch}
        handleTableScan={handleTableScan}
      />
      <SearchResult searchResult={searchResult} />
      <TableScanResult tableScanResult={tableScanResult} pageSize={pageSize} />
      {lines.length > (currentPage + 1) * linesPerPage && (
        <button onClick={loadMoreData}>Carregar Mais Dados</button>
      )}
      <HashIndexTable hashIndex={hashIndex} stats={stats} />
    </div>
  );
};

export default App;
