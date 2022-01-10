import {
  differenceInCalendarDays,
  differenceInSeconds,
  startOfTomorrow,
} from 'date-fns';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';

import Guess from '@app/components/Guess';
import Keyboard from '@app/components/Keyboard';
import LoseDialog from '@app/components/LoseDialog';
import WinDialog from '@app/components/WinDialog';
import { START_DATE } from '@app/config/private';
import { times } from '@app/lib/collections';
import { Game, GameState, useGame } from '@app/lib/game';

type Props = {
  game: Game;
  nextGameStartsAt: number;
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
    maxGuesses: 6,
    solution,
    validWords,
  };

  const nextGameStartsAt = startOfTomorrow();
  const gameExpires = differenceInSeconds(nextGameStartsAt, now, {
    roundingMethod: 'ceil',
  });

  return {
    props: {
      game,
      nextGameStartsAt: nextGameStartsAt.getTime(),
    },
    revalidate: gameExpires,
  };
};

const HomePage = ({ game, nextGameStartsAt: nextGameStartsAtTime }: Props) => {
  const [previousGameState, setPreviousGameState] =
    useState<GameState>('playing');
  const [visibleDialog, setVisibleDialog] = useState<GameState | null>(null);

  const nextGameStartsAt = useMemo(
    () => new Date(nextGameStartsAtTime),
    [nextGameStartsAtTime]
  );

  const {
    currentGuess,
    futureGuessCount,
    gameState,
    keyboardHints,
    previousGuesses,
    wordLength,
    onClickBackspace,
    onClickEnter,
    onClickLetter,
  } = useGame(game);

  useEffect(() => {
    if (gameState !== previousGameState) {
      setPreviousGameState(gameState);
      setVisibleDialog(gameState);
    }
  }, [gameState, previousGameState, setPreviousGameState, setVisibleDialog]);

  return (
    <>
      <Head>
        <title>SQWORDLE #{game.day}</title>
        <meta name="description" content="A Pokémon-themed take on Wordle." />
      </Head>

      <div className="page">
        <h1>SQWORDLE #{game.day}</h1>
        <h2>Who&apos;s that pokémon?</h2>

        <div className="guesses">
          {previousGuesses.map(({ guess, results }, index) => (
            <Guess
              key={`previous-${index}`}
              length={wordLength}
              results={results}
              type="previous"
              word={guess}
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
          hints={keyboardHints}
          onClickBackspace={onClickBackspace}
          onClickEnter={onClickEnter}
          onClickLetter={onClickLetter}
        />

        {visibleDialog === 'lost' && (
          <LoseDialog
            game={game}
            nextGameStartsAt={nextGameStartsAt}
            onClose={() => setVisibleDialog(null)}
          />
        )}
        {visibleDialog === 'won' && (
          <WinDialog
            game={game}
            guesses={previousGuesses}
            nextGameStartsAt={nextGameStartsAt}
            onClose={() => setVisibleDialog(null)}
          />
        )}
      </div>
      <style jsx>{`
        .page {
          margin-bottom: 210px;
        }

        h1 {
          margin: 1em 0 0.25em 0;

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
    </>
  );
};

export default HomePage;
