import classNames from 'classnames';

import { GuessType, LetterResult, RESULT_LABELS } from '@app/lib/game';

import styles from './GuessLetter.module.scss';

type Props = {
  letter: string;
  result: LetterResult;
  type: GuessType;
};

export const GuessLetter = ({ letter, result, type }: Props) => (
  <div
    aria-invalid={
      type === 'previous' ? result !== LetterResult.Correct : undefined
    }
    aria-label={RESULT_LABELS[result] || undefined}
    className={classNames(styles.letter, styles[result])}
  >
    {letter}
  </div>
);
