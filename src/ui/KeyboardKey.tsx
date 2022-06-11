import { LetterResult, RESULT_LABELS } from '@app/lib/game';
import { styled } from '@app/ui/core';

type Props = {
  children: string;
  hint: LetterResult;
  letter: string;
  onClick?: () => void;
};

const Button = styled('button', {
  display: 'block',
  flex: '1 1 5vw',
  height: 45,

  appearance: 'none',
  border: 'none',
  cursor: 'pointer',

  fontFamily: '$monospace',
  fontSize: '$xs',

  '@sm': {
    fontSize: '$sm',
  },

  '@md': {
    fontSize: '$md',
  },

  '&:disabled': {
    opacity: 0.6,
  },

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

export const KeyboardKey = ({ children, hint, letter, onClick }: Props) => (
  <Button
    aria-details={RESULT_LABELS[hint]}
    aria-label={letter}
    className={hint}
    disabled={typeof onClick === 'undefined'}
    onClick={onClick}
  >
    <span aria-hidden>{children}</span>
  </Button>
);
