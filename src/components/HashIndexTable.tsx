import React from 'react';

interface Tuple {
  key: string;
  data: unknown;
}

interface Props {
  hashIndex: {
    pages: {
      tuples: Tuple[];
    }[];
  } | null;
  stats: {
    nrBuckets: number;
    collisions: number;
    overflows: number;
    searchCost: number;
    tableScanCost: number;
  };
}

const HashIndexTable: React.FC<Props> = ({ hashIndex, stats }) => {
  if (!hashIndex) return null;

  return (
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
                <td>{tupleIndex + pageIndex * 100}</td>
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
  );
};

export default HashIndexTable;
