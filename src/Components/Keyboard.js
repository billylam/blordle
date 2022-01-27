import React, { useEffect } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import '../Style/Keyboard.css';

function KB({ letters, onKeyPress }) {
  const perfectLetters = Object.entries(letters).filter((entry) => entry[1] === 'G').map((entry) => entry[0]).join(' ');
  const badLetters = Object.entries(letters).filter((entry) => entry[1] === 'R').map((entry) => entry[0]).join(' ');
  const goodLetters = Object.entries(letters).filter((entry) => entry[1] === 'Y').map((entry) => entry[0]).join(' ');

  const keyHandler = ({ key }) => {
    // Standardize with 3rd party keyboard
    if (key === 'Enter') onKeyPress('{enter}');
    else if (key === 'Backspace') onKeyPress('{bksp}');
    else if (/^[A-Z]$/.test(key.toUpperCase())) onKeyPress(key.toUpperCase());
  };

  useEffect(() => {
    window.addEventListener('keydown', keyHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', keyHandler);
    };
  }); // Empty array ensures that effect is only run on mount and unmount

  return (
    <Keyboard
      onKeyPress={onKeyPress}
      layout={{
        default: [
          'Q W E R T Y U I O P',
          'A S D F G H J K L',
          '{enter} Z X C V B N M {bksp}',
        ],
      }}
      display={{
        '{bksp}': '⌫',
        '{enter}': '⏎',
      }}
      buttonTheme={[{
        class: 'correct',
        buttons: perfectLetters || ' ',
      },
      {
        class: 'almost',
        buttons: goodLetters || ' ',
      },
      {
        class: 'nope',
        buttons: badLetters || ' ',
      }]}
    />
  );
}

export default KB;
