import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import './index.css';
import App from './App.jsx';
import ContextProviders from "./components/ContextProviders";

ReactDOM.render(
  <ContextProviders>
    <Router>
      <App />
    </Router>
  </ContextProviders>,
  document.getElementById('root')
);
