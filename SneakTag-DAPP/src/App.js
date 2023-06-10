import React, { useState } from 'react';
import './css/App.css';
import Home from './components/Home.js';
import Connect from './components/Connect.js';
import Transfer from './components/Transfer.js';
import Mlogin from './components/Mlogin.js';
import Price from './components/Price.js';

function App() {
  const [page, setPage] = useState('Home');

  const handleClick = (newPage) => {
    setPage(newPage);
  };

  const renderPage = () => {
    switch (page) {
      case 'Home':
        return <Home />;
      case 'Transfer':
        return <Transfer />;
      case 'Connect':
        return <Connect />;
      case 'Mlogin':
        return <Mlogin />;
      case 'Price':
        return <Price />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="App">
      <nav>
        <ul>
          <li className="button-container1">
            <button class="button" onClick={() => handleClick('Home')}>Home</button>
          </li>
          <li className="button-container2">
            <button class="button" onClick={() => handleClick('Transfer')}>Transfer</button>
          </li>
          <li className="button-container3">
            <button class="button" onClick={() => handleClick('Connect')}>Connect</button>
          </li>
          <li className="button-container4">
            <button class="button" onClick={() => handleClick('Mlogin')}>Mlogin</button>
          </li>
          <li className="button-container5">
            <button class="button" onClick={() => handleClick('Price')}>Price</button>
          </li>
        </ul>
      </nav>
      {renderPage()}
    </div>
  );
}

export default App;
