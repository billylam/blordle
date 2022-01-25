import React, { useState } from 'react';

function Square(props) {
  return (
      <button className={"square " + (props.color === 'G' ? 'correct ' : '') + (props.color === 'Y' ? 'almost' : '')}>
        {props.letter}
      </button>
  );
}

const Word = (props) => {
  const colors = props.colors?.split('')
  // if we have a current guess / length, right pad it with spaces
  let paddedWord = props.word || ''
  if (props.length) paddedWord = paddedWord.padEnd(5, ' ')
  const word = paddedWord.split('').map((letter, i) => <Square letter={letter} color={colors && colors[i]} />)
  return (<div className="word">{word}</div>)
}

export default Word;