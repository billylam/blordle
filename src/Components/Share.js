import { Buffer } from 'buffer';

const Share = (props) => {
  const share = () => {
    let text = props.isWinner ? `Blordle! ${props.guesses.length}/6\n` : 'Blordle!  I lost!\n';
    text = text.concat(props.guesses.map((guess, i) => {
      let letters = guess.split('').map((letter, j) => {
        switch (props.colors[i].charAt(j)) {
          case 'G':
            return '🟩';
          case 'Y':
            return '🟨';
          default:
            return '⬛';
        }
      }).join('')
      return letters;
    }).join('\n'))
    text = text.concat(`\nPlay this Blordle at\n${`https://billylam.github.io/blordle/?q=${Buffer.from(props.target).toString('base64')}`}`)
    navigator.clipboard.writeText(text);
    props.setIsCopied();
  }
  return (<div onClick={share}>⇧</div>)
}

export default Share;