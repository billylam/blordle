import React, {Component} from 'react';
import Word from './Word'
import data from '../data'
import KB from './Keyboard'
export default class Game extends Component {
  constructor(props) {
    super(props)

    const target = data[Math.floor(Math.random() * data.length)].toUpperCase()

    this.state = {
      guesses: [],
      colors: [],
      currentGuess: '',
      isWinner: false,
      isLoser: false,
      isActive: true,
      target: target,
      guessedLetters: {},
    }

    // this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.colorize = this.colorize.bind(this)
  }
  
  // handleChange(e) {
  //   if ((/^[a-zA-Z]*$/.test(e.target.value))) {
  //     this.setState({currentGuess: e.target.value.toUpperCase()})
  //   }
  // }

  handleSubmit() {
    if (this.state.currentGuess.length !== 5) {
      return;
    }

    const guesses = this.state.guesses.slice()
    this.colorize()

    if (this.state.currentGuess === this.state.target) {
      this.setState({isWinner: true, isActive: false})
    }
    else if (this.state.guesses.length === 5){
      this.setState({isLoser: true, isActive: false})
    }
    this.setState({guesses: guesses.concat([this.state.currentGuess]), currentGuess: ''})
  }
  
  colorize() {
    // Rules: 
    //   First hash count of each letter in target
    const counts = {};
    if (!this.state.targetLetterCounts) {
      for (let i = 0; i < this.state.target.length; i++) {
        if (counts[this.state.target[i]]) {
          counts[this.state.target[i]] = counts[this.state.target[i]] + 1
        }
        else counts[this.state.target[i]] = 1
      }
    }
    
    //   Iterate through each guess's letters twice
    //   Handle exact matches first and color green, decrement if found
    const colors = Array(this.state.target.length).fill('')
    for (let i = 0; i < this.state.currentGuess.length; i++) {
      if (this.state.currentGuess[i] === this.state.target[i]) {
        colors[i] = 'G'
        counts[this.state.currentGuess[i]] = counts[this.state.currentGuess[i]] - 1
      }
    }
    //   Handle rest
    for (let i = 0; i < this.state.currentGuess.length; i++) {
      if (this.state.currentGuess[i] !== this.state.target[i]) {
        if (counts[this.state.currentGuess[i]] > 0) {
          colors[i] = 'Y'
          counts[this.state.currentGuess[i]] = counts[this.state.currentGuess[i]] - 1
        }
        else colors[i] = 'R'
      }
    }
    //   Join string and pass to state
    this.setState({colors: this.state.colors.slice().concat([colors.join('')])})
  }

  onKeyPress = (button) => {
    if (button === '{enter}') {
      this.handleSubmit();
      return;
    }
    if (button === '{bksp}' && this.state.currentGuess.length !== 0) {
      this.setState({currentGuess: this.state.currentGuess.slice(0, -1)})
      return;
    } 
    if (this.state.currentGuess.length < 5) this.setState({currentGuess: this.state.currentGuess + button})
    // this.setState({currentGuess: e.target.value.toUpperCase()})
  }

  render() {
    const words = this.state.guesses.map((guess, i) => <div><Word word={guess} colors={this.state.colors[i]} /></div>)
    const currentWord = this.state.isActive && <div><Word length={this.state.target.length} word={this.state.currentGuess} /></div>
    let numBlanks = 6 - this.state.guesses.length;
    if (this.state.isActive) numBlanks--
    console.log(numBlanks)
    const blanks = Array(numBlanks).fill(null).map(() => <div><Word word={Array(this.state.target.length).fill(' ').join('')} /></div>)

    return (<div className="game">
      <div className="words">
        {words}
        {currentWord}
        {blanks}
      </div>
      {/* <form onSubmit={this.handleSubmit}>
        <input id="guess" maxLength="5" autoComplete="off" disabled={!this.state.isActive} onChange={this.handleChange} value={this.state.currentGuess} />
      </form> */}
      {this.state.isWinner && <div>Welcome to Costco, I love you</div>}
      {this.state.isLoser && <div>Whoomp, there it is not {this.state.target}</div>}
      {this.state.isActive && <div>
        <KB onKeyPress={this.onKeyPress} />
      </div>}
    </div>)
  }
}