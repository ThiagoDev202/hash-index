import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';  // Ajuste o caminho para a pasta styles
import App from './components/App';  // Ajuste o caminho para a pasta components

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
