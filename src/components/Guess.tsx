import { times } from '@app/lib/collections';
import { LetterResult, RESULT_LABELS } from '@app/lib/game';

const RESULT_DESCRIPTIONS: { [result in LetterResult]: string } = {
  [LetterResult.Correct]: 'This letter is correct',
  [LetterResult.Empty]: '',
  [LetterResult.Incorrect]: 'This letter is not present in the word',
  [LetterResult.Present]:
    'This letter is preset in the word, but in another position',
};

type Props = {
  length: number;
  results?: LetterResult[];
  type: 'current' | 'future' | 'previous';
  word?: string;
};

const Guess = ({ length, results = [], type, word = '' }: Props) => (
  <>
    <div className="guess">
      {times(length, (index) => (
        <Letter
          key={String(index)}
          letter={word[index] || ' '}
          result={results[index] || LetterResult.Empty}
          type={type}
        />
      ))}
    </div>
    <style jsx>{`
      .guess {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        margin-bottom: 1em;
      }

      .guess:last-child {
        margin-bottom: 0;
      }
    `}</style>
  </>
);

const Letter = ({
  letter,
  result,
  type,
}: {
  letter: string;
  result: LetterResult;
  type: Props['type'];
}) => (
  <>
    <div
      aria-description={RESULT_DESCRIPTIONS[result] || undefined}
      aria-invalid={
        type === 'previous' ? result !== LetterResult.Correct : undefined
      }
      aria-label={RESULT_LABELS[result] || undefined}
      className={`letter ${result}`}
    >
      {letter}
    </div>
    <style jsx>{`
      .letter {
        flex: 1 1;
        height: 2em;
        margin-right: 1em;

        line-height: 2em;
        text-align: center;
        text-transform: uppercase;
      }
      .letter:last-child {
        margin-right: 0;
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
        color: white;
      }

      .present {
        background-color: yellow;
        color: black;
      }
    `}</style>
  </>
);

export default Guess;
