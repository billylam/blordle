import React, {Component} from 'react';
import Word from './Word'
import targets from '../Data/targets'
import KB from './Keyboard'
import dictionary from '../Data/dictionary';
export default class Game extends Component {
  constructor(props) {
    super(props)

    const target = targets[Math.floor(Math.random() * targets.length)]

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

    this.handleSubmit = this.handleSubmit.bind(this)
    this.colorize = this.colorize.bind(this)
  }

  handleSubmit() {
    if (this.state.currentGuess.length !== 5 || !dictionary.includes(this.state.currentGuess)) {
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
    const letters = {}
    for (let i = 0; i < this.state.currentGuess.length; i++) {
      if (this.state.currentGuess[i] === this.state.target[i]) {
        colors[i] = 'G'
        letters[this.state.currentGuess[i]] = 'G'

        counts[this.state.currentGuess[i]] = counts[this.state.currentGuess[i]] - 1
      }
    }
    //   Handle rest
    for (let i = 0; i < this.state.currentGuess.length; i++) {
      if (this.state.currentGuess[i] !== this.state.target[i]) {
        if (counts[this.state.currentGuess[i]] > 0) {
          colors[i] = 'Y'
          if (letters[this.state.currentGuess[i]] !== 'G') letters[this.state.currentGuess[i]] = 'Y'
          counts[this.state.currentGuess[i]] = counts[this.state.currentGuess[i]] - 1
        }
        else {
          colors[i] = 'R'
          if (letters[this.state.currentGuess[i]] !== 'G' && letters[this.state.currentGuess[i]] !== 'Y') letters[this.state.currentGuess[i]] = 'R'
        }
      }
    }
    //   Join string and pass to state
    this.setState(prevState => ({
      colors: this.state.colors.slice().concat([colors.join('')]),
      guessedLetters: {...prevState.guessedLetters, ...letters}
    }))
  }

  onKeyPress = (button) => {
    if (button === '{enter}') {
      this.handleSubmit();
      return;
    }
    else if (button === '{bksp}') {
      if (this.state.currentGuess.length !== 0)
        this.setState({currentGuess: this.state.currentGuess.slice(0, -1)})
      return;
    } 
    else if (this.state.currentGuess.length < 5) this.setState({currentGuess: this.state.currentGuess + button})
  }

  render() {
    const words = this.state.guesses.map((guess, i) => <div><Word word={guess} colors={this.state.colors[i]} /></div>)
    const currentWord = this.state.isActive && <div><Word length={this.state.target.length} word={this.state.currentGuess} /></div>
    let numBlanks = 6 - this.state.guesses.length;
    if (this.state.isActive) numBlanks--
    const blanks = Array(numBlanks).fill(null).map(() => <div><Word word={Array(this.state.target.length).fill(' ').join('')} /></div>)

    return (<div className="game">
      <div className="words">
        {words}
        {currentWord}
        {blanks}
      </div>
      {this.state.isWinner && <div>Welcome to Costco, I love you</div>}
      {this.state.isLoser && <div>Whoomp, there it is not {this.state.target}</div>}
      {this.state.isActive && <div>
        <KB letters={this.state.guessedLetters} onKeyPress={this.onKeyPress} />
      </div>}
    </div>)
  }
}