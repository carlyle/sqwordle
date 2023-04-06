import { useEffect } from 'react';

import { ALPHABET, LetterResult } from '@app/lib/game';
import { KeyboardKey } from '@app/ui/KeyboardKey';

import styles from './Keyboard.module.scss';

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

export const Keyboard = ({
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
    <div className={styles.keyboard}>
      {LETTERS.map((row, index) => (
        <div className={styles.row} key={String(index)}>
          {row.map((letter) => {
            if (letter === 'backspace') {
              return (
                <KeyboardKey
                  hint={LetterResult.Empty}
                  key="backspace"
                  letter={letter}
                  onClick={onClickBackspace}
                >
                  🔙
                </KeyboardKey>
              );
            }

            if (letter === 'enter') {
              return (
                <KeyboardKey
                  hint={LetterResult.Empty}
                  key="enter"
                  letter={letter}
                  onClick={onClickEnter}
                >
                  ⏎
                </KeyboardKey>
              );
            }

            return (
              <KeyboardKey
                hint={hints[letter] || LetterResult.Empty}
                key={letter}
                letter={letter}
                onClick={
                  typeof onClickLetter === 'function'
                    ? () => onClickLetter(letter)
                    : undefined
                }
              >
                {letter.toUpperCase()}
              </KeyboardKey>
            );
          })}
        </div>
      ))}
    </div>
  );
};
