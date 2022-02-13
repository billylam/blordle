import React from 'react';
import '../Style/Modal.css';

function Modal({ handleModalClose }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <header className="modal-header">
          <div> </div>
          <div className="modal-title">Stats</div>
          <div className="modal-close" onClick={handleModalClose}>ⓧ</div>
        </header>
        <div className="mainStats">
          <div>
            {' '}
            Wins:
            {' '}
            {localStorage.getItem('wins')}
          </div>
          <div>
            {' '}
            Total:
            {' '}
            {localStorage.getItem('gamesPlayed')}
          </div>
          <div>
            {' '}
            Win%:
            {' '}
            {localStorage.getItem('gamesPlayed') === '0' ? '0' : Math.floor(100 * (Number.parseInt(localStorage.getItem('wins'), 10) / Number.parseInt(localStorage.getItem('gamesPlayed'), 10)))}
          </div>
          <div>
            {' '}
            Streak:
            {' '}
            {localStorage.getItem('streak')}
            {Number.parseInt(localStorage.getItem('streak'), 10) >= 10 && ' 🔥'}
          </div>
        </div>
        <div className="winStats">
          <div>
            {' '}
            1:
            {' '}
            {localStorage.getItem('1')}
          </div>
          <div>
            {' '}
            2:
            {' '}
            {localStorage.getItem('2')}
          </div>
          <div>
            {' '}
            3:
            {' '}
            {localStorage.getItem('3')}
          </div>
          <div>
            {' '}
            4:
            {' '}
            {localStorage.getItem('4')}
          </div>
          <div>
            {' '}
            5:
            {' '}
            {localStorage.getItem('5')}
          </div>
          <div>
            {' '}
            6:
            {' '}
            {localStorage.getItem('6')}
          </div>
          <div>
            {' '}
            Losses:
            {' '}
            {localStorage.getItem('losses')}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
