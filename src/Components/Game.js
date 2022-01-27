import { Buffer } from 'buffer';
import React, { useState } from 'react';
import Word from './Word';
import targets from '../Data/targets';
import KB from './Keyboard';
import dictionary from '../Data/dictionary';
import '../Style/Game.css';
import '../Style/Keyboard.css';
import Share from './Share';

function Game({ isDisplayingModal, isAndroidWebview }) {
  const [guesses, setGuesses] = useState([]);
  const [colors, setColors] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [isWinner, setIsWinner] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [guessedLetters, setGuessedLetters] = useState({});
  const [currentWordStyle, setCurrentWordStyle] = useState('valid');
  const [isCopied, setIsCopied] = useState(false);
  const [messaging, setMessaging] = useState('');

  const getTarget = () => {
    const { search } = window.location;
    const params = new URLSearchParams(search);
    const q = params.get('q');
    if (q && Buffer.from(params.get('q'), 'base64').toString('ascii')
          && guesses.length === 0 /* Prevents reusing query string when tapping reload button */) {
      const paramTarget = Buffer.from(params.get('q'), 'base64').toString('ascii');
      if (paramTarget.length === 5 && dictionary.includes(paramTarget.toUpperCase())) return Buffer.from(params.get('q'), 'base64').toString('ascii').toUpperCase();
    }

    return targets[Math.floor(Math.random() * targets.length)];
  };

  const [target, setTarget] = useState(() => getTarget());

  const reload = () => {
    setTarget(getTarget());
    setGuesses([]);
    setColors([]);
    setCurrentGuess('');
    setIsWinner(false);
    setIsActive(true);
    setGuessedLetters({});
    setIsCopied(false);
    setMessaging('');
  };

  const colorize = () => {
    // Rules:
    //   First hash count of each letter in target
    const counts = {};
    for (let i = 0; i < target.length; i++) {
      if (counts[target[i]]) {
        counts[target[i]] += 1;
      } else counts[target[i]] = 1;
    }

    //   Iterate through each guess's letters twice
    //   Handle exact matches first and color green, decrement if found
    const colorCalc = Array(target.length).fill('');
    const letters = {};
    for (let i = 0; i < currentGuess.length; i++) {
      if (currentGuess[i] === target[i]) {
        colorCalc[i] = 'G';
        letters[currentGuess[i]] = 'G';

        counts[currentGuess[i]] -= 1;
      }
    }
    //   Handle rest
    for (let i = 0; i < currentGuess.length; i++) {
      if (currentGuess[i] !== target[i]) {
        if (counts[currentGuess[i]] > 0) {
          colorCalc[i] = 'Y';
          if (letters[currentGuess[i]] !== 'G' && guessedLetters[currentGuess[i]] !== 'G') letters[currentGuess[i]] = 'Y';
          counts[currentGuess[i]] -= 1;
        } else {
          colorCalc[i] = 'R';
          if (letters[currentGuess[i]] !== 'G' && letters[currentGuess[i]] !== 'Y'
            && guessedLetters[currentGuess[i]] !== 'G' && guessedLetters[currentGuess[i]] !== 'Y') letters[currentGuess[i]] = 'R';
        }
      }
    }

    //   Join string and pass to state
    setColors(colors.slice().concat([colorCalc.join('')]));
    setGuessedLetters((prevState) => ({ ...prevState, ...letters }));
  };

  const handleSubmit = () => {
    if (currentGuess.length !== 5 || !dictionary.includes(currentGuess)) {
      setCurrentWordStyle('invalid');
      setTimeout(() => {
        setCurrentWordStyle('valid');
      }, 500);
      return;
    }

    colorize();

    if (currentGuess === target) {
      setIsWinner(true);
      setIsActive(false);
      const praises = ['Nice job!', 'Awe-inspiring!', 'Excellent!', 'Winner!', 'Yeah boyeee!', 'Welcome to Costco, I love you'];
      setMessaging(praises[Math.floor(Math.random() * praises.length)]);
    } else if (guesses.length === 5) {
      setIsActive(false);
      const slams = ['Bad job!  It was ', "Whoomp there it ISN'T: ", 'Aww so close: ', 'Better luck next time: '];
      setMessaging(`${slams[Math.floor(Math.random() * slams.length)]} ${target}`);
    }
    setGuesses(guesses.slice().concat([currentGuess]));
    setCurrentGuess('');
  };
  const onKeyPress = (button) => {
    if (isDisplayingModal) {
      return;
    }
    if (button.toString() === '{enter}') {
      handleSubmit();
    } else if (button === '{bksp}') {
      if (currentGuess.length !== 0) setCurrentGuess(currentGuess.slice(0, -1));
    } else if (currentGuess.length < 5) setCurrentGuess(currentGuess.concat(button));
  };

  const words = guesses.map((guess, i) => <div><Word word={guess} colors={colors[i]} /></div>);
  const currentWord = isActive
    && <div><Word wordStyle={currentWordStyle} length={target.length} word={currentGuess} /></div>;
  let numBlanks = 6 - guesses.length;
  if (isActive) numBlanks -= 1;
  const blanks = Array(numBlanks).fill(null).map(() => <div><Word word={Array(target.length).fill(' ').join('')} /></div>);

  return (
    <div className="game">
      <div className="words">
        {words}
        {currentWord}
        {blanks}
      </div>
      <div className="messaging">
        {!isActive && <div>{messaging}</div>}
      </div>
      <div className="finished-buttons">
        {!isActive && <div className="reload" onClick={reload}>↻</div>}
        {(!isAndroidWebview && !isActive)
          && (
          <Share
            setIsCopied={() => setIsCopied(true)}
            isWinner={isWinner}
            guesses={guesses}
            colors={colors}
            target={target}
          />
          )}
      </div>
      {isCopied && <div>Copied to clipboard!</div>}
      {(isAndroidWebview && !isActive)
        && <div>Use a different browser to enable sharing and puzzle creation!</div>}
      {isActive && (
      <div>
        <KB letters={guessedLetters} onKeyPress={onKeyPress} />
      </div>
      )}
    </div>
  );
}

export default Game;
