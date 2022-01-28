import React, { useState } from 'react';
import './App.css';
import Game from './Components/Game';
import Modal from './Components/Modal';
import Stats from './Components/Stats';

function App() {
  const [isDisplayingModal, setIsDisplayingModal] = useState(false);
  const [isDisplayingStats, setIsDisplayingStats] = useState(false);
  const [isAndroidWebview] = useState(() => {
    const ua = navigator.userAgent;
    return ua.includes('Android') && (ua.includes('wv') || ua.includes('Version/'));
  });
  return (
    <div className="App">
      <header className="App-header">
        {isAndroidWebview ? <div /> : <div onClick={() => setIsDisplayingStats(true)}>📊</div>}
        <div className="title">BLORDLE!</div>
        {isAndroidWebview ? <div /> : <div onClick={() => setIsDisplayingModal(true)} className="create">📝</div>}
      </header>
      {isDisplayingStats && <Stats handleModalClose={() => setIsDisplayingStats(false)} />}
      {isDisplayingModal && <Modal handleModalClose={() => setIsDisplayingModal(false)} />}
      <Game isAndroidWebview={isAndroidWebview} isDisplayingModal={isDisplayingModal} />
    </div>
  );
}

export default App;
