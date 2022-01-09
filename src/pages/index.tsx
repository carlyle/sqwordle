import {
  differenceInCalendarDays,
  differenceInSeconds,
  startOfTomorrow,
} from 'date-fns';
import { GetStaticProps } from 'next';
import { useState } from 'react';

import Guess from '@app/components/Guess';
import Keyboard from '@app/components/Keyboard';
import { START_DATE } from '@app/config/private';
import { times } from '@app/lib/collections';
import {
  ALPHABET,
  evaluateGuess,
  Game,
  isBetterResult,
  LetterResult,
} from '@app/lib/game';

type Props = {
  game: Game;
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const now = new Date();
  const day = differenceInCalendarDays(now, START_DATE) + 1;

  const { readFile } = await import('fs/promises');
  const { resolve } = await import('path');

  const words = (
    await readFile(resolve(process.cwd(), 'src', 'config', 'words.txt'), {
      encoding: 'utf8',
    })
  )
    .split('\n')
    .filter((line) => line !== null);

  const solution = words[day - 1];
  const validWords = words
    .filter((word) => word.length === solution.length)
    .sort();

  const game: Game = {
    day,
    maxGuesses: solution.length + 1,
    solution,
    validWords,
  };

  const gameExpires = differenceInSeconds(startOfTomorrow(), now, {
    roundingMethod: 'ceil',
  });

  return {
    props: {
      game,
    },
    revalidate: gameExpires,
  };
};

const HomePage = ({ game }: Props) => {
  const [previousGuesses, setPreviousGuesses] = useState<string[]>([]); // TODO use localStorage instead
  const [currentGuess, setCurrentGuess] = useState<string>('');

  const wordLength = game.solution.length;
  const hints = ALPHABET.reduce(
    (hints, letter) => ({ ...hints, [letter]: LetterResult.Empty }),
    {} as Record<string, LetterResult>
  );
  const previousResults: LetterResult[][] = [];
  let gameState: 'lost' | 'playing' | 'won' = 'playing';
  for (const guess of previousGuesses) {
    const results = evaluateGuess({ guess, solution: game.solution });
    for (let index = 0; index < wordLength; index++) {
      const letter = guess[index];
      const result = results[index];
      if (isBetterResult(result, hints[letter])) {
        hints[letter] = result;
      }
    }
    previousResults.push(results);

    if (results.every((result) => result === LetterResult.Correct)) {
      gameState = 'won';
    }
  }
  if (previousGuesses.length === game.maxGuesses && gameState !== 'won') {
    gameState = 'lost';
  }

  const onClickBackspace =
    gameState === 'playing' && currentGuess.length > 0
      ? () => {
          setCurrentGuess((currentGuess) =>
            currentGuess.slice(0, currentGuess.length - 1)
          );
        }
      : undefined;

  const onClickEnter =
    gameState === 'playing' && currentGuess.length === wordLength
      ? () => {
          if (!game.validWords.includes(currentGuess)) {
            window.alert("Sorry, that's not a pokemon");
            return;
          }

          setPreviousGuesses((previousGuesses) => [
            ...previousGuesses,
            currentGuess,
          ]);
          setCurrentGuess('');

          if (currentGuess === game.solution) {
            window.alert('Congratulations!');
            return;
          }

          if (previousGuesses.length === game.maxGuesses - 1) {
            window.alert(
              `Sorry, it was ${game.solution.toUpperCase()}. Better luck next time!`
            );
            return;
          }
        }
      : undefined;

  const onClickLetter =
    gameState === 'playing' && currentGuess.length < wordLength
      ? (letter: string) => {
          setCurrentGuess((currentGuess) => `${currentGuess}${letter}`);
        }
      : undefined;

  const futureGuessCount =
    game.maxGuesses -
    previousGuesses.length -
    (gameState === 'playing' ? 1 : 0);

  return (
    <div className="page">
      <h1>Sqwordle #{game.day}</h1>
      <h2>Who&apos;s that pokémon?</h2>

      <div className="guesses">
        {previousGuesses.map((guess, index) => (
          <Guess
            key={`previous-${index}`}
            length={wordLength}
            results={evaluateGuess({ guess, solution: game.solution })}
            type="previous"
            word={previousGuesses[index]}
          />
        ))}
        {gameState === 'playing' &&
          previousGuesses.length < game.maxGuesses && (
            <Guess
              key="current"
              length={wordLength}
              type="current"
              word={currentGuess}
            />
          )}
        {times(futureGuessCount, (index) => (
          <Guess key={`future-${index}`} length={wordLength} type="future" />
        ))}
      </div>

      <p className="disclaimer">
        A Pokémon-themed take on{' '}
        <a
          href="https://www.powerlanguage.co.uk/wordle/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Wordle
        </a>
        .
      </p>
      <p className="disclaimer">Please don&apos;t sue me, Nintendo.</p>

      <Keyboard
        hints={hints}
        onClickBackspace={onClickBackspace}
        onClickEnter={onClickEnter}
        onClickLetter={onClickLetter}
      />

      <style jsx>{`
        .page {
          margin-bottom: 210px;
        }

        h1 {
          margin: 0 0 0.25em 0;

          text-align: center;
        }

        h2 {
          margin: 0 0 1em 0;

          font-size: 1.2em;
          text-align: center;
        }

        .guesses {
          margin: 0 0 2em 0;
        }

        .disclaimer {
          margin: 0 auto 1em auto;
          width: 80%;

          color: darkgrey;
          font-size: 12px;
          text-align: center;
        }

        .disclaimer a {
          color: rgb(89, 89, 231);
          text-decoration: none;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
