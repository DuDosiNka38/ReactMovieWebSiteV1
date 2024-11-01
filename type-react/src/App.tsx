import React from 'react';
import './App.css';
import Cards, { CardsVariant } from './components/cards';

function App() {
  return (
    <div className="App">
    <Cards variant={CardsVariant.outlined} width='200px' height='200px'>
      <button></button>
      </Cards>

    </div>
  );
}

export default App;
