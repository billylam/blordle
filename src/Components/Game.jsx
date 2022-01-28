import React, { useState } from 'react';
import Word from './Word';
import targets from '../Data/targets';
import KB from './Keyboard';
import dictionary from '../Data/dictionary';
import randomizedDict from '../Data/randomizedDict';
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

  // Initialize stats
  if (!localStorage.getItem('wins')) localStorage.setItem('wins', '0');
  if (!localStorage.getItem('streak')) localStorage.setItem('streak', '0');
  if (!localStorage.getItem('maxStreak')) localStorage.setItem('maxStreak', '0');
  if (!localStorage.getItem('gamesPlayed')) localStorage.setItem('gamesPlayed', '0');
  if (!localStorage.getItem('1')) localStorage.setItem('1', '0');
  if (!localStorage.getItem('2')) localStorage.setItem('2', '0');
  if (!localStorage.getItem('3')) localStorage.setItem('3', '0');
  if (!localStorage.getItem('4')) localStorage.setItem('4', '0');
  if (!localStorage.getItem('5')) localStorage.setItem('5', '0');
  if (!localStorage.getItem('6')) localStorage.setItem('6', '0');
  if (!localStorage.getItem('losses')) localStorage.setItem('losses', '0');

  const incrementLocalStorage = (key) => {
    const count = Number.parseInt(localStorage.getItem(key), 10);
    localStorage.setItem(key, (count + 1).toString());
  };

  const getTarget = () => {
    const { search } = window.location;
    const params = new URLSearchParams(search);
    const qs = params.get('game');
    if (qs && guesses.length === 0 /* Prevents reusing query string when tapping reload button */) {
      const i = Number.parseInt(qs, 10);
      if (i >= 1 && i <= randomizedDict.length) return randomizedDict[i - 1];
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

      incrementLocalStorage('streak');
      incrementLocalStorage('gamesPlayed');
      incrementLocalStorage('wins');

      if (Number.parseInt(localStorage.getItem('streak'), 10) > Number.parseInt(localStorage.getItem('maxStreak'), 10)) localStorage.setItem('maxStreak', localStorage.getItem('streak'));
      incrementLocalStorage(guesses.length.toString());

      const praises = ['Nice job!', 'Awe-inspiring!', 'Excellent!', 'Winner!', 'Yeah boyeee!', '🤯',
        'Breathtaking!', 'Boom shaka-laka!', 'Is that Bill Shakespeare over there!?', 'Welcome to Costco, I love you'];
      setMessaging(praises[Math.floor(Math.random() * praises.length)]);
    } else if (guesses.length === 5) {
      setIsActive(false);

      localStorage.setItem('streak', '0');
      incrementLocalStorage('gamesPlayed');
      incrementLocalStorage('losses');

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
