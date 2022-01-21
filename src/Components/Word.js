import React, {Component} from 'react';

function Square(props) {
  return (
      <button className={"square " + (props.color === 'G' ? 'correct ' : '') + (props.color === 'Y' ? 'almost' : '')}>
        {props.letter}
      </button>
  );
}

export default class Word extends Component {
  render() {
    const colors = this.props.colors?.split('')
    // if we have a current guess / length, right pad it with spaces
    let paddedWord = this.props.word || ''
    if (this.props.length) paddedWord = paddedWord.padEnd(5, ' ')
    const word = paddedWord.split('').map((letter, i) => <Square letter={letter} color={colors && colors[i]} />)
    return (<div>{word}</div>)
  }
}