import classNames from 'classnames';

import { LetterResult, RESULT_LABELS } from '@app/lib/game';

type Props = {
  children: string;
  hint: LetterResult;
  letter: string;
  onClick?: () => void;
};

const keyClassNamesByHint = {
  [LetterResult.Correct]: 'bg-green-400 text-green-950',
  [LetterResult.Empty]: 'bg-slate-200 text-slate-950',
  [LetterResult.Incorrect]: 'bg-slate-500 text-slate-50',
  [LetterResult.Present]: 'bg-yellow-400 text-yellow-950',
} satisfies Record<LetterResult, string>;

export const KeyboardKey = ({ children, hint, letter, onClick }: Props) => (
  <button
    aria-details={RESULT_LABELS[hint]}
    aria-label={letter}
    className={classNames(
      'flex h-11 shrink grow basis-[5vw] items-center justify-center font-mono text-xs disabled:opacity-60 sm:text-sm md:text-base',
      keyClassNamesByHint[hint]
    )}
    disabled={typeof onClick === 'undefined'}
    onClick={onClick}
  >
    <span aria-hidden>{children}</span>
  </button>
);
