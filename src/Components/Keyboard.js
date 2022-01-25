import React, { useState } from 'react';
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

const KB = (props) => {
    const [perfectLetters, setPerfectLetters] = useState(Object.entries(props.letters).filter(entry => entry[1] === 'G').map(entry => entry[0]).join(' '))
    const [badLetters, setBadLetters] = useState(Object.entries(props.letters).filter(entry => entry[1] === 'R').map(entry => entry[0]).join(' '))
    const [goodLetters, setGoodLetters] = useState(Object.entries(props.letters).filter(entry => entry[1] === 'Y').map(entry => entry[0]).join(' '))

    return (
    <Keyboard
    onKeyPress={props.onKeyPress}
    layout={{
        default: [
          "Q W E R T Y U I O P",
          "A S D F G H J K L",
          "{enter} Z X C V B N M {bksp}"
        ],
      }}
      display={{
          '{bksp}': '⌫',
          '{enter}': '⏎',
      }}
      buttonTheme={[{
        class: "correct",
        buttons: perfectLetters || ' ',
      },
      {
        class: "almost",
        buttons: goodLetters || ' ',
      },
      { 
        class: "nope",
        buttons: badLetters || ' ',
      }]}
    />)
}

export default KB;