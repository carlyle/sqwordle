import { ALPHABET, LetterResult, RESULT_LABELS } from '@app/lib/game';
import { useEffect } from 'react';

const LETTERS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['backspace', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'enter'],
];

type Props = {
  hints: Record<string, LetterResult>;
  onClickBackspace?: () => void;
  onClickEnter?: () => void;
  onClickLetter?: (letter: string) => void;
};

const Key = ({
  hint,
  label,
  onClick,
}: {
  hint: LetterResult;
  label: string;
  onClick?: () => void;
}) => (
  <>
    <button
      aria-label={RESULT_LABELS[hint]}
      className={`key ${hint}`}
      disabled={typeof onClick === 'undefined'}
      onClick={onClick}
    >
      {label}
    </button>
    <style jsx>{`
      .key {
        flex: 1 1 auto;
        height: 2em;
        margin-right: 0.5em;

        appearance: none;
        border: none;
        cursor: pointer;
      }
      .key:disabled {
        opacity: 0.5;
      }
      .key:last-child {
        margin-right: 0;
      }

      .correct {
        background-color: green;
        color: white;
      }

      .empty {
        background-color: lightgrey;
        color: black;
      }

      .incorrect {
        background-color: darkgrey;
        color: grey;
      }

      .present {
        background-color: yellow;
        color: black;
      }
    `}</style>
  </>
);

const Keyboard = ({
  hints,
  onClickBackspace,
  onClickEnter,
  onClickLetter,
}: Props) => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }

      const key = event.key.toLowerCase();
      if (key === 'backspace') {
        if (typeof onClickBackspace === 'function') {
          onClickBackspace();
        }

        return;
      }

      if (key === 'enter') {
        if (typeof onClickEnter === 'function') {
          onClickEnter();
        }

        return;
      }

      if (ALPHABET.includes(key)) {
        if (typeof onClickLetter === 'function') {
          onClickLetter(key);
        }

        return;
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onClickBackspace, onClickEnter, onClickLetter]);

  return (
    <>
      <div className="keyboard">
        {LETTERS.map((row, index) => (
          <div className="row" key={String(index)}>
            {row.map((letter) => {
              if (letter === 'backspace') {
                return (
                  <Key
                    hint={LetterResult.Empty}
                    key="backspace"
                    label="🔙"
                    onClick={onClickBackspace}
                  />
                );
              }

              if (letter === 'enter') {
                return (
                  <Key
                    hint={LetterResult.Empty}
                    key="enter"
                    label="Enter"
                    onClick={onClickEnter}
                  />
                );
              }

              return (
                <Key
                  hint={hints[letter] || LetterResult.Empty}
                  key={letter}
                  label={letter.toUpperCase()}
                  onClick={
                    typeof onClickLetter === 'function'
                      ? () => onClickLetter(letter)
                      : undefined
                  }
                />
              );
            })}
          </div>
        ))}
      </div>
      <style jsx>{`
        .row {
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          margin: 0 auto 0.5em auto;
          width: 90%;
        }
        .row:last-child {
          margin-bottom: 0;
        }
      `}</style>
    </>
  );
};

export default Keyboard;
