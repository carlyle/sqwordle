import { times } from '@app/lib/collections';
import { GuessType, LetterResult } from '@app/lib/game';
import { GuessLetter } from '@app/ui/GuessLetter';

type Props = {
  length: number;
  results?: LetterResult[];
  type: GuessType;
  word?: string;
};

export const GuessWord = ({ length, results = [], type, word = '' }: Props) => (
  <div className="mx-auto mb-2.5 flex w-[90%] flex-row flex-nowrap justify-between gap-x-2.5 last:mb-0">
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
