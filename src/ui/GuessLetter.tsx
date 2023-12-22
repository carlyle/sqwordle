import { cva } from 'class-variance-authority';

import { LetterResult, RESULT_LABELS, type GuessType } from '@app/lib/game';

interface Props {
  letter: string;
  result: LetterResult;
  type: GuessType;
}

const letterClassName = cva('h-8 flex-1 text-center uppercase leading-8', {
  defaultVariants: {
    result: LetterResult.Empty,
  },
  variants: {
    result: {
      [LetterResult.Correct]: 'bg-green-400 text-green-950',
      [LetterResult.Empty]: 'bg-slate-200 text-slate-950',
      [LetterResult.Incorrect]: 'bg-slate-500 text-slate-50',
      [LetterResult.Present]: 'bg-yellow-400 text-yellow-950',
    } satisfies Record<LetterResult, string>,
  },
});

export const GuessLetter = ({ letter, result, type }: Props) => (
  <div
    aria-invalid={
      type === 'previous' ? result !== LetterResult.Correct : undefined
    }
    aria-label={RESULT_LABELS[result] || undefined}
    className={letterClassName({ result })}
  >
    {letter}
  </div>
);
