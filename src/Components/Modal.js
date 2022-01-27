import React, { useState, useEffect } from 'react';
import '../Style/Modal.css';
import { Buffer } from 'buffer';
import Dictionary from '../Data/dictionary';

function Modal(props) {
  const [value, setValue] = useState('');
  const [output, setOutput] = useState('');
  const [isCopyable, setIsCopyable] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const handleChange = (e) => {
    setValue(e.target.value);
    setOutput('');
    setIsCopyable(false);
    setIsCopied(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Dictionary.includes(value.toUpperCase())) {
      setIsCopyable(true);
      setOutput(`https://billylam.github.io/blordle/?q=${Buffer.from(value).toString('base64')}`);
    } else setOutput('Invalid input.');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setIsCopied(true);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <header className="modal-header">
          <div> </div>
          <div className="modal-title">Create a custom Blordle!</div>
          <div className="modal-close" onClick={props.handleModalClose}>ⓧ</div>
        </header>
        <div>
          <form onSubmit={handleSubmit}>
            <input maxLength={5} className="modal-input" type="text" placeholder="Enter a real 5 letter word" value={value} onSubmit={handleSubmit} onChange={handleChange} />
            <button type="submit">Go!</button>
          </form>
        </div>
        {output && (
        <div className="output">
          {isCopyable && (
          <div
            className="copy"
            onClick={handleCopy}
          >
            {' '}
            ✂
          </div>
          )}
          <div>
            {' '}
            {output}
            {' '}
          </div>
        </div>
        )}
        {isCopied && <div>Copied to clipboard!</div>}
      </div>
    </div>
  );
}

export default Modal;
