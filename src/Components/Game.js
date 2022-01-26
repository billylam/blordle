import React, { useState, useEffect } from 'react';
import Word from './Word'
import targets from '../Data/targets'
import KB from './Keyboard'
import dictionary from '../Data/dictionary';
import "../Style/Game.css"
import "../Style/Keyboard.css"
import { Buffer } from 'buffer';
import Share from './Share'

const Game = (props) => {
  const getTarget = () => {
    let search = window.location.search;
    let params = new URLSearchParams(search);
    const q = params.get('q');
    if (q && Buffer.from(params.get('q'), 'base64').toString('ascii') 
          && guesses.length === 0 /* Prevents reusing query string when tapping reload button */) {
      const paramTarget = Buffer.from(params.get('q'), 'base64').toString('ascii');
      if (paramTarget.length === 5 && dictionary.includes(paramTarget.toUpperCase()))
        return Buffer.from(params.get('q'), 'base64').toString('ascii').toUpperCase();
    }
    
    return targets[Math.floor(Math.random() * targets.length)]
  }

  const [guesses, setGuesses] = useState([])
  const [colors, setColors] = useState([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [isWinner, setIsWinner] = useState(false)
  const [isLoser, setIsLoser] = useState(false)
  const [isActive, setIsActive] = useState(true)
  const [target, setTarget] = useState(() => {
    return getTarget();
  })
  const [guessedLetters, setGuessedLetters] = useState({})

  const reload = () => {
    setTarget(getTarget())
    setGuesses([])
    setColors([])
    setCurrentGuess('')
    setIsWinner(false)
    setIsLoser(false)
    setIsActive(true)
    setGuessedLetters({})
  }

  const handleSubmit = (props) => {
    if (currentGuess.length !== 5 || !dictionary.includes(currentGuess)) {
      return;
    }

    colorize()

    if (currentGuess === target) {
      setIsWinner(true)
      setIsActive(false)
    }
    else if (guesses.length === 5) {
      setIsLoser(true)
      setIsActive(false)
    }
    setGuesses(guesses.slice().concat([currentGuess]))
    setCurrentGuess('')
  }
  
  const colorize = () => {
    // Rules: 
    //   First hash count of each letter in target
    const counts = {};
    for (let i = 0; i < target.length; i++) {
      if (counts[target[i]]) {
        counts[target[i]] = counts[target[i]] + 1
      }
      else counts[target[i]] = 1
    }
    
    //   Iterate through each guess's letters twice
    //   Handle exact matches first and color green, decrement if found
    const colorCalc = Array(target.length).fill('')
    const letters = {}
    for (let i = 0; i < currentGuess.length; i++) {
      if (currentGuess[i] === target[i]) {
        colorCalc[i] = 'G'
        letters[currentGuess[i]] = 'G'

        counts[currentGuess[i]] = counts[currentGuess[i]] - 1
      }
    }
    //   Handle rest
    for (let i = 0; i < currentGuess.length; i++) {
      if (currentGuess[i] !== target[i]) {
        if (counts[currentGuess[i]] > 0) {
          colorCalc[i] = 'Y'
          if (letters[currentGuess[i]] !== 'G') letters[currentGuess[i]] = 'Y'
          counts[currentGuess[i]] = counts[currentGuess[i]] - 1
        }
        else {
          colorCalc[i] = 'R'
          if (letters[currentGuess[i]] !== 'G' && letters[currentGuess[i]] !== 'Y') letters[currentGuess[i]] = 'R'
        }
      }
    }

    //   Join string and pass to state
    setColors(colors.slice().concat([colorCalc.join('')]))
    setGuessedLetters(prevState => {
      return {...prevState, ...letters}
    })
  }

  const onKeyPress = (button) => {
    if (props.isDisplayingModal) {
      return;
    }
    if (button.toString() === '{enter}') {
      handleSubmit();
      return;
    }
    else if (button === '{bksp}') {
      if (currentGuess.length !== 0)
        setCurrentGuess(currentGuess.slice(0, -1))
      return;
    } 
    else if (currentGuess.length < 5) setCurrentGuess(currentGuess.concat(button))
  }

  const words = guesses.map((guess, i) => <div><Word word={guess} colors={colors[i]} /></div>)
  const currentWord = isActive && <div><Word length={target.length} word={currentGuess} /></div>
  let numBlanks = 6 - guesses.length;
  if (isActive) numBlanks--
  const blanks = Array(numBlanks).fill(null).map(() => <div><Word word={Array(target.length).fill(' ').join('')} /></div>)

  const praises = ["Nice job!", "Awe-inspiring!", "Excellent!", "Winner!", "Yeah boyeee!", "Welcome to Costco, I love you"];
  const slams = ["Bad job!  It was ", "Whoomp there it ISN'T: ", "Aww so close: ", "Better luck next time: "]

  return (<div className="game">
    <div className="words">
      {words}
      {currentWord}
      {blanks}
    </div>
    <div className="messaging">
      {isWinner && <div>{praises[Math.floor(Math.random() * praises.length)]}</div>}
      {isLoser && <div>{slams[Math.floor(Math.random() * slams.length)]} {target}</div>}

    </div>
    <div className="finished-buttons">
      {!isActive && <div className="reload" onClick={reload}>↻</div>}
      {!isActive && <Share guesses={guesses} colors={colors} target={target} />}
    </div>
    {isActive && <div>
      <KB letters={guessedLetters} onKeyPress={onKeyPress} />
    </div>}
  </div>)
}

export default Game;