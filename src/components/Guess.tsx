import { times } from '@app/lib/collections';
import { LetterResult, RESULT_LABELS } from '@app/lib/game';

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
        display: grid;
        gap: 8px;
        grid-auto-flow: column;
        grid-auto-columns: minmax(0, 1fr);
        margin: 0 auto 10px auto;
        width: 90%;
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
        height: 2em;

        line-height: 2em;
        text-align: center;
        text-transform: uppercase;
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
        color: grey;
      }

      .present {
        background-color: yellow;
        color: black;
      }
    `}</style>
  </>
);

export default Guess;
