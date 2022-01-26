import { useState } from 'react';
import './App.css';
import Game from './Components/Game'
import Modal from './Components/Modal'

function App() {
  const [shouldDisplayModal, setShouldDisplayModal] = useState(false)
  const handleModalClose = () => {
    setShouldDisplayModal(false)
  }
  return (
    <div className="App">
      <header className="App-header">
        <div className="left">+</div>
        <div className="title">BLORDLE!</div>
        <div onClick={() => setShouldDisplayModal(true)} className="create">⨁</div>
      </header>
      {shouldDisplayModal && <Modal handleModalClose={handleModalClose} />}
      <Game></Game>
    </div>
  );
}



export default App;
