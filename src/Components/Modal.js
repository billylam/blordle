import React, { useState, useEffect } from 'react';
import "../Style/Modal.css"
import Dictionary from '../Data/dictionary';
import { Buffer } from 'buffer';

const Modal = (props) => {
  const [value, setValue] = useState('');
  const [output, setOutput] = useState('');
  const handleChange = (e) => {
    setValue(e.target.value)
    setOutput('')
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Dictionary.includes(value.toUpperCase())) {
      setOutput(`https://billylam.github.io/blordle/?q=${Buffer.from(value).toString('base64')}`)
    }
    else setOutput('Invalid input.')
  }

  return (<div className="modal">
    <div className="modal-content">
      <header className="modal-header">
        <div> </div>
        <div className="modal-title">Create a custom Blordle!™</div>
        <div className="modal-close" onClick={props.handleModalClose}>ⓧ</div>
      </header>
      <div>
        <form onSubmit={handleSubmit} >
          <input className="modal-input" type="text" placeholder="Enter a real 5 letter word" value={value} onSubmit={handleSubmit} onChange={handleChange}></input>
          <button type="submit">Go!</button>
        </form>
      </div>
      {output && <div className="output">
        <div className="copy" onClick={() => {navigator.clipboard.writeText(output)}}
> ✂ </div>
          <div> {output} </div>
        </div>}
    </div>
  </div>)
}

export default Modal;