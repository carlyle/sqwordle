import { cva } from 'class-variance-authority';

import { LetterResult, RESULT_LABELS } from '@app/lib/game';

type Props = {
  children: string;
  hint: LetterResult;
  letter: string;
  onClick?: () => void;
};

const keyClassName = cva(
  'flex grow shrink basis-[5vw] items-center justify-center h-11 font-mono text-xs sm:text-sm md:text-base disabled:opacity-60',
  {
    defaultVariants: { hint: LetterResult.Empty },
    variants: {
      hint: {
        [LetterResult.Correct]: 'bg-green-400 text-green-950',
        [LetterResult.Empty]: 'bg-slate-200 text-slate-950',
        [LetterResult.Incorrect]: 'bg-slate-500 text-slate-50',
        [LetterResult.Present]: 'bg-yellow-400 text-yellow-950',
      } satisfies Record<LetterResult, string>,
    },
  }
);

export const KeyboardKey = ({ children, hint, letter, onClick }: Props) => (
  <button
    aria-details={RESULT_LABELS[hint]}
    aria-label={letter}
    className={keyClassName({ hint })}
    disabled={typeof onClick === 'undefined'}
    onClick={onClick}
  >
    <span aria-hidden>{children}</span>
  </button>
);
