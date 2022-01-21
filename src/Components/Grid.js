import React, {Component} from 'react';
import Word from './Word'

export default class Grid extends Component {
  render() {
    const words = this.props.guesses.map((guess) => <div><Word word={guess} /></div>)
    const numBlanks = 6 - this.props.guesses.length
    const blanks = Array(numBlanks).fill(null).map(() => <div><Word word='     ' /></div>)
    return (
      <div>{words}
      {blanks}</div>
      )
  }
}