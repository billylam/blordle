import { useState } from 'react';
import './App.css';
import Game from './Components/Game'
import Modal from './Components/Modal'

function App() {
  const [isDisplayingModal, setIsDisplayingModal] = useState(false)
  const handleModalClose = () => {
    setIsDisplayingModal(false)
  }
  return (
    <div className="App">
      <header className="App-header">
        <div className="left">+</div>
        <div className="title">BLORDLE!</div>
        <div onClick={() => setIsDisplayingModal(true)} className="create">⨁</div>
      </header>
      {isDisplayingModal && <Modal handleModalClose={handleModalClose} />}
      <Game isDisplayingModal={isDisplayingModal}></Game>
    </div>
  );
}



export default App;
