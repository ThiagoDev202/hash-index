import React from 'react';

interface SearchResultProps {
  searchResult: { key: string; data: unknown } | null;
}

const SearchResult: React.FC<SearchResultProps> = ({ searchResult }) => (
  <div>
    <h2>Resultado da Busca</h2>
    {searchResult ? (
      <div>
        <p><strong>Chave:</strong> {searchResult.key}</p>
        <p><strong>Dados:</strong> {JSON.stringify(searchResult.data)}</p>
      </div>
    ) : (
      <p>Nenhum resultado encontrado.</p>
    )}
  </div>
);

export default SearchResult;
