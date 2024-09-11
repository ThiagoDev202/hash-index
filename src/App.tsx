import { useEffect, useState } from 'react';
import Table from './dataStructures/Table';
import "./App.css"


import axios from 'axios';
import { Entry, SearchResult, Stats } from './dataStructures/Types';
import HashIndex from './dataStructures/HashIndex';

function App() {
  const [entry, setEntry] = useState<Entry>({
    dataQuantity: 0,
    pageSize: 0,
    bucketSize: 0,
  })

  const [stats, setStats] = useState<Stats>({
    pageQuantity: 0,
    bucketQuantity: 0,
  })

  const [table, setTable] = useState<Table>()
  const [hashIndex, setHashIndex] = useState<HashIndex>()

  const [searchKey, setSearchKey] = useState<string>("")
  const [searchResult, setSearchResult] = useState<SearchResult>()
  const [scanResult, setScanResult] = useState<SearchResult>()

  //getting data
  useEffect(() => {
    axios.get("https://raw.githubusercontent.com/dwyl/english-words/master/words.txt")
      .then(res => {
        const file = res.data
        const lines: string[] = file.split("\n")

        const newTable = new Table()
        newTable.loadData(lines)
        setTable(newTable)

        setEntry(current => ({ ...current, dataQuantity: lines.length }))
      })
  }, []);

  //handles the changing of entry data
  useEffect(() => {
    let pageQuantity = Math.ceil(entry.dataQuantity / entry.pageSize)
    let bucketQuantity = Math.ceil(entry.dataQuantity / entry.bucketSize)

    setStats(current => ({
      ...current,
      pageQuantity,
      bucketQuantity
    }))
  }, [entry])

  const handleSubmit = () => {
    if (table && entry.bucketSize > 0 && entry.pageSize > 0) {
      const newHashIndex = new HashIndex(table, entry, stats);
      setHashIndex(newHashIndex);
    }
  }

  const handleSearch = () => {
    if (table && hashIndex) {
      let result = hashIndex.search(searchKey)
      setSearchResult(result ? result : undefined)
    }
  }

  const handleTableScan = () => {
    if (table && hashIndex) {
      let cost = 0;
      for (let page of hashIndex.pages) {
        cost++;
        for (let tuple of page.tuples) {
          if (tuple.key === searchKey) {
            setScanResult({ tuple, page: cost - 1, cost });
            setStats(current => ({ ...current, tableScanCost: cost }))
            return;
          }
        }
      }
      setScanResult(undefined);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Índice Hash</h1>
        <div>
          <label>
            Tamanho da Página:
            <input
              type="number"
              value={entry.pageSize}
              onChange={(e) => setEntry(current => ({ ...current, pageSize: Number(e.target.value) }))}
            />
          </label>
          <label>
            Tamanho do Bucket:
            <input
              type="number"
              value={entry.bucketSize}
              onChange={(e) => setEntry(current => ({ ...current, bucketSize: Number(e.target.value) }))}
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
            <div>
              <p>Chave: {searchResult.tuple.key}</p>
              <p>Dado: {JSON.stringify(searchResult.tuple.data)}</p>
              <p>pagina: {searchResult.page}</p>
              <p>Custo de Busca: {searchResult.cost}</p>
            </div>
          </div>
        )}
        <button onClick={handleTableScan}>Table Scan</button>
        {scanResult && (
          <div>
            <h2>Resultado do tableScan:</h2>
            <div>
              <p>Chave: {scanResult.tuple.key}</p>
              <p>Dado: {JSON.stringify(scanResult.tuple.data)}</p>
              <p>pagina: {scanResult.page}</p>
              <p>Custo de Busca: {scanResult.cost}</p>
            </div>
          </div>
        )}

        {hashIndex && (
          <div>
            <h3>Estatísticas</h3>
            <ul>
              <li>Quantidade de paginas: {stats.pageQuantity}</li>
              <li>Número de Buckets: {stats.bucketQuantity}</li>
              <li>Colisões: {hashIndex.collisions}</li>
              <li>Overflows: {hashIndex.overflows}</li>
            </ul>
          </div>
        )}
      </header>
    </div>
  )
}

export default App
