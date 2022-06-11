import { GuessType, LetterResult, RESULT_LABELS } from '@app/lib/game';
import { styled } from '@app/ui/core';

type Props = {
  letter: string;
  result: LetterResult;
  type: GuessType;
};

const Letter = styled('div', {
  flex: '1 1 0',
  height: '2rem',

  lineHeight: '2rem',
  textAlign: 'center',
  textTransform: 'uppercase',

  '&.correct': {
    backgroundColor: '$green10',
    color: '$green2',
  },

  '&.empty': {
    backgroundColor: '$slate5',
    color: '$slate12',
  },

  '&.incorrect': {
    backgroundColor: '$slate5',
    color: '$slate11',
  },

  '&.present': {
    backgroundColor: '$yellow10',
    color: '$yellow2',
  },
});

export const GuessLetter = ({ letter, result, type }: Props) => (
  <Letter
    aria-invalid={
      type === 'previous' ? result !== LetterResult.Correct : undefined
    }
    aria-label={RESULT_LABELS[result] || undefined}
    className={result}
  >
    {letter}
  </Letter>
);
