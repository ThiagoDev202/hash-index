import React from 'react';

interface TableScanResultProps {
  tableScanResult: { key: string; data: unknown }[] | null;
  pageSize: number;
}

const TableScanResult: React.FC<TableScanResultProps> = ({ tableScanResult, pageSize }) => (
  <div>
    <h2>Resultado do Scan da Tabela</h2>
    {tableScanResult ? (
      <table>
        <thead>
          <tr>
            <th>Chave</th>
            <th>Dados</th>
          </tr>
        </thead>
        <tbody>
          {tableScanResult.map((result, index) => (
            <tr key={index}>
              <td>{result.key}</td>
              <td>{JSON.stringify(result.data)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>Nenhum resultado encontrado.</p>
    )}
  </div>
);

export default TableScanResult;
