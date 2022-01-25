import React, { useState, useEffect } from 'react';
import Word from './Word'
import targets from '../Data/targets'
import KB from './Keyboard'
import dictionary from '../Data/dictionary';

const Game = () => {
  const [guesses, setGuesses] = useState([])
  const [colors, setColors] = useState([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [isWinner, setIsWinner] = useState(false)
  const [isLoser, setIsLoser] = useState(false)
  const [isActive, setIsActive] = useState(true)
  const [target, setTarget] = useState(targets[Math.floor(Math.random() * targets.length)])
  const [guessedLetters, setGuessedLetters] = useState({})

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
    if (button === '{enter}') {
      handleSubmit();
      return;
    }
    else if (button === '{bksp}') {
      if (currentGuess.length !== 0)
        setCurrentGuess(currentGuess.slice(0, -1))
      return;
    } 
    else if (currentGuess.length < 5) setCurrentGuess(currentGuess + button)
  }

  const words = guesses.map((guess, i) => <div><Word word={guess} colors={colors[i]} /></div>)
  const currentWord = isActive && <div><Word length={target.length} word={currentGuess} /></div>
  let numBlanks = 6 - guesses.length;
  if (isActive) numBlanks--
  const blanks = Array(numBlanks).fill(null).map(() => <div><Word word={Array(target.length).fill(' ').join('')} /></div>)

  return (<div className="game">
    <div className="words">
      {words}
      {currentWord}
      {blanks}
    </div>
    {isWinner && <div>Welcome to Costco, I love you</div>}
    {isLoser && <div>Whoomp, there it is not {target}</div>}
    {isActive && <div>
      <KB letters={guessedLetters} onKeyPress={onKeyPress} />
    </div>}
  </div>)
}

export default Game;