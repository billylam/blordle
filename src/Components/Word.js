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
    console.log(colors)
    const word = this.props.word?.split('').map((letter, i) => <Square letter={letter} color={colors[i]} />)
    return (<div>{word}</div>)
  }
}