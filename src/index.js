import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.jsx';
import ContextProviders from "./components/ContextProviders";

ReactDOM.render(
  <ContextProviders>
    <App />
  </ContextProviders>,
  document.getElementById('root')
);
