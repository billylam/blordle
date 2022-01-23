import React, {Component} from 'react';
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

export default class KB extends Component {
  render() {
    return (
    <Keyboard
    onKeyPress={this.props.onKeyPress}
    layout={{
        default: [
          "Q W E R T Y U I O P",
          "A S D F G H J K L",
          "{enter} Z X C V B N M {bksp}"
        ],
      }} display={{
          '{bksp}': '⌫',
          '{enter}': '↩',
        }}
    />)
  }
}