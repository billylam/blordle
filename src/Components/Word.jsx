import React from 'react';

function Square({ color, letter, wordStyle }) {
  return (
    <div className={`square ${wordStyle || ''
    }${color === 'G' ? 'correct ' : ''
    }${color === 'Y' ? 'almost' : ''
    }${color === 'R' ? 'nope' : ''}`}
    >
      {letter}
    </div>
  );
}

function Word({
  colors, word, length, wordStyle,
}) {
  const colorsArray = colors?.split('');
  // if we have a current guess / length, right pad it with spaces
  let paddedWord = word || '';
  if (length) paddedWord = paddedWord.padEnd(5, ' ');
  const toRender = paddedWord.split('').map((letter, i) => <Square wordStyle={wordStyle} letter={letter} color={colorsArray && colorsArray[i]} />);
  return (<div className="word">{toRender}</div>);
}

export default Word;
