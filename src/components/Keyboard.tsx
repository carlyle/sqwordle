import { useEffect } from 'react';

import { ALPHABET, LetterResult, RESULT_LABELS } from '@app/lib/game';

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
  letter,
  onClick,
}: {
  hint: LetterResult;
  label: string;
  letter: string;
  onClick?: () => void;
}) => (
  <>
    <button
      aria-label={RESULT_LABELS[hint]}
      className={`key ${letter} ${hint}`}
      disabled={typeof onClick === 'undefined'}
      onClick={onClick}
    >
      {label}
    </button>

    <style jsx>{`
      .key {
        height: 45px;

        appearance: none;
        border: none;
        cursor: pointer;
      }

      .key:disabled {
        opacity: 0.5;
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
                    letter={letter}
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
                    letter={letter}
                    onClick={onClickEnter}
                  />
                );
              }

              return (
                <Key
                  hint={hints[letter] || LetterResult.Empty}
                  key={letter}
                  label={letter.toUpperCase()}
                  letter={letter}
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
        .keyboard {
          bottom: 0;
          height: 190px;
          left: 0;
          padding: 20px 10px;
          position: fixed;
          right: 0;

          background-color: #f0f0f0;
        }

        .row {
          display: grid;
          gap: 2px;
          grid-auto-flow: column;
          margin: 0 auto 0.5em auto;
        }

        .row:last-child {
          margin-bottom: 0;
        }
      `}</style>
    </>
  );
};

export default Keyboard;
