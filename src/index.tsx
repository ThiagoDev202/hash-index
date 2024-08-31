import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';  
import App from './components/App';  

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Elemento com id "root" não encontrado.');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
