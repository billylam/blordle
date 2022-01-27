import React, { useState } from 'react';
import './App.css';
import Game from './Components/Game';
import Modal from './Components/Modal';

function App() {
  const [isDisplayingModal, setIsDisplayingModal] = useState(false);
  const handleModalClose = () => {
    setIsDisplayingModal(false);
  };
  const [isAndroidWebview] = useState(() => {
    const ua = navigator.userAgent;
    return ua.includes('Android') && (ua.includes('wv') || ua.includes('Version/'));
  });
  return (
    <div className="App">
      <header className="App-header">
        {isAndroidWebview ? <div /> : <div className="left">+</div>}
        <div className="title">BLORDLE!</div>
        {isAndroidWebview ? <div /> : <div onClick={() => setIsDisplayingModal(true)} className="create">⨁</div>}
      </header>
      {isDisplayingModal && <Modal handleModalClose={handleModalClose} />}
      <Game isAndroidWebview={isAndroidWebview} isDisplayingModal={isDisplayingModal} />
    </div>
  );
}

export default App;
