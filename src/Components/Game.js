import React, {Component} from 'react';
import Grid from './Grid'
import Word from './Word'
export default class Game extends Component {
  constructor(props) {
    super(props)
    this.state = {
      guesses: [],
      currentGuess: '',
      isWinner: false,
      isLoser: false,
      target: 'WINNR',
      disabled: false,
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  
  handleChange(e) {
    if ((/^[a-zA-Z]*$/.test(e.target.value))) {
      this.setState({currentGuess: e.target.value.toUpperCase()})
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.currentGuess.length !== 5) {
      return;
    }


    const guesses = this.state.guesses.slice()
    this.setState({guesses: guesses.concat([this.state.currentGuess]), currentGuess: ''})
    if (this.state.currentGuess === this.state.target){
      this.setState({isWinner: true})
    }
    else if (this.state.guesses.length + 1 === 6){
      this.setState({isLoser: true})
    }
  }

  render() {
    const words = this.state.guesses.map((guess) => <Word />)
    return (<div>
      <Grid guesses={this.state.guesses} />
      <Word />
      <form onSubmit={this.handleSubmit}>
        <input id="guess" maxLength='5' disabled={(this.state.isLoser || this.state.isWinner)} onChange={this.handleChange} value={this.state.currentGuess} />
      </form>
      {this.state.isWinner && <span>Nice job!</span>}
      {this.state.isLoser && <span>Bad job!</span>}
    </div>)
  }
}