import { differenceInSeconds } from 'date-fns';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';

import Guess from '@app/components/Guess';
import Keyboard from '@app/components/Keyboard';
import LoseDialog from '@app/components/LoseDialog';
import WinDialog from '@app/components/WinDialog';
import { ORIGIN } from '@app/config/public';
import { times } from '@app/lib/collections';
import { Game, GameState, getGameForToday, useGame } from '@app/lib/game';

type Props = {
  game: Game;
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const { WORDS } = await import('@app/config/private');

  const game = getGameForToday({ words: WORDS });

  const gameExpiresIn = differenceInSeconds(game.endsAt, new Date(), {
    roundingMethod: 'ceil',
  });

  return {
    props: {
      game,
    },
    revalidate: gameExpiresIn,
  };
};

const HomePage = ({ game }: Props) => {
  const [previousGameState, setPreviousGameState] =
    useState<GameState>('playing');
  const [visibleDialog, setVisibleDialog] = useState<GameState | null>(null);

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

  const shareImageUrl = new URL('/share.png', ORIGIN);

  return (
    <>
      <Head>
        <title>SQWORDLE #{game.day}</title>

        <meta name="description" content="A Pokemon-themed take on Wordle" />
        <link rel="canonical" href={ORIGIN} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:description"
          content="A Pokemon-themed take on Wordle"
        />
        <meta name="twitter:image" content={shareImageUrl.toString()} />
        <meta name="twitter:title" content="SQWORDLE" />
        <meta name="twitter:url" content={ORIGIN} />

        <meta
          property="og:description"
          content="A Pokemon-themed take on Wordle"
        />
        <meta property="og:image" content={shareImageUrl.toString()} />
        <meta property="og:title" content="SQWORDLE" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={ORIGIN} />
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
        <p className="disclaimer">
          <a
            href="https://github.com/carlyle/sqwordle"
            rel="noopener noreferrer"
            target="_blank"
          >
            View Source
          </a>
        </p>

        <Keyboard
          hints={keyboardHints}
          onClickBackspace={onClickBackspace}
          onClickEnter={onClickEnter}
          onClickLetter={onClickLetter}
        />

        {visibleDialog === 'lost' && (
          <LoseDialog
            game={game}
            nextGameStartsAt={game.endsAt}
            onClose={() => setVisibleDialog(null)}
          />
        )}
        {visibleDialog === 'won' && (
          <WinDialog
            game={game}
            guesses={previousGuesses}
            nextGameStartsAt={game.endsAt}
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
