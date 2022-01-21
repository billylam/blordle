import React, {Component} from 'react';

function Square(props) {
  return (
      <button className="square">
        {props.letter}
      </button>
  );
}

export default class Word extends Component {
  render() {
    const word = this.props.word?.split('').map((letter) => <Square letter={letter} />)
    return (<div>{word}</div>)
  }
}