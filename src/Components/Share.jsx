import { Buffer } from 'buffer';

function Share({
  isWinner, setIsCopied, guesses, colors, target,
}) {
  const share = () => {
    let text = isWinner ? `Blordle! ${guesses.length}/6\n` : 'Blordle!  I lost!\n';
    text = text.concat(guesses.map((guess, i) => {
      const letters = guess.split('').map((letter, j) => {
        switch (colors[i].charAt(j)) {
          case 'G':
            return '🟩';
          case 'Y':
            return '🟨';
          default:
            return '⬛';
        }
      }).join('');
      return letters;
    }).join('\n'));
    text = text.concat(`\nPlay this Blordle at\n${`https://billylam.github.io/blordle/?q=${Buffer.from(target).toString('base64')}`}`);
    navigator.clipboard.writeText(text);
    setIsCopied();
  };
  return (<div onClick={share}>⇧</div>);
}

export default Share;
