import { useEffect, useState } from 'react';
import Table from './dataStructures/Table';
import styles from "./App.module.css"


import axios from 'axios';
import { Entry, SearchResult, Stats } from './dataStructures/Types';
import HashIndex from './dataStructures/HashIndex';
import { InputRegister } from './components/InputRegiter/InputRegister';

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

      }).catch(_ => console.log("xaMAIS DARÁ"))

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
    <div className={styles.body} >
      <header className={styles.header}>
        <h1>Índice Hash</h1>
      </header>

      <div className={styles.inputs}>
        <InputRegister
          label='Tamanho da Pagina'
          value={entry.pageSize === 0 ? "" : entry.pageSize}
          type='number'
          changevalue={(new_value) => setEntry(current => ({ ...current, pageSize: Number(new_value) }))}
        />
        <InputRegister
          label='Tamanho do Bucket'
          value={entry.bucketSize === 0 ? "" : entry.bucketSize}
          type='number'
          changevalue={(new_value) => setEntry(current => ({ ...current, bucketSize: Number(new_value) }))}
        />
        <button onClick={handleSubmit}>Criar Estrutura Hash</button>
      </div>

      {hashIndex && (
        <div className={styles.wrapper}>
          <div className={styles.statistics}>
            <h2>Estatísticas</h2>
            <ul>
              <li>Quantidade de dados: {entry.dataQuantity}</li>
              <li>Quantidade de paginas: {stats.pageQuantity}</li>
              <li>Número de Buckets: {stats.bucketQuantity}</li>
              <li>Colisões: {hashIndex.collisions}</li>
              <li>Overflows: {hashIndex.overflows}</li>
            </ul>
          </div>

          <div className={styles.search}>
            <InputRegister
              type='text'
              value={searchKey}
              changevalue={(new_value => setSearchKey(new_value))}
              label='Chave de busca'
              placeholder="Digite a chave de busca"
            />
            <div className={styles.conteiners}>
              <div className={styles.searchconteiner}>
                <button onClick={handleSearch}>Buscar</button>
                {searchResult && (
                  <>
                    {/* <h3>Resultado da Busca:</h3> */}
                    <ul>
                      <li>Chave: {searchResult.tuple.key}</li>
                      <li>Dado: {JSON.stringify(searchResult.tuple.data)}</li>
                      <li>pagina: {searchResult.page}</li>
                      <li>Custo de Busca: {searchResult.cost}</li>
                    </ul>
                  </>
                )}
              </div>

              <div className={styles.searchconteiner}>
                <button onClick={handleTableScan}>Table Scan</button>
                {scanResult && (
                  <>
                    {/* <h3>Resultado do tableScan:</h3> */}
                    <ul>
                      <li>Chave: {scanResult.tuple.key}</li>
                      <li>Dado: {JSON.stringify(scanResult.tuple.data)}</li>
                      <li>pagina: {scanResult.page}</li>
                      <li>Custo de Busca: {scanResult.cost}</li>
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}







    </div>
  )
}

export default App
