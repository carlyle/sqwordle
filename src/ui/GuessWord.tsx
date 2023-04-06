import { times } from '@app/lib/collections';
import { GuessType, LetterResult } from '@app/lib/game';
import { GuessLetter } from '@app/ui/GuessLetter';

import styles from './GuessWord.module.scss';

type Props = {
  length: number;
  results?: LetterResult[];
  type: GuessType;
  word?: string;
};

export const GuessWord = ({ length, results = [], type, word = '' }: Props) => (
  <div className={styles.word}>
    {times(length, (index) => (
      <GuessLetter
        key={String(index)}
        letter={word[index] || ' '}
        result={results[index] || LetterResult.Empty}
        type={type}
      />
    ))}
  </div>
);
