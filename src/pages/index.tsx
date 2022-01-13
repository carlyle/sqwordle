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
import {
  Game,
  GameStatus,
  getDay,
  getGameForDay,
  useGame,
} from '@app/lib/game';

type Props = {
  game: Game;
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const { WORDS } = await import('@app/config/private');

  const game = getGameForDay({ day: getDay(), words: WORDS });

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
  const [previousStatus, setPreviousStatus] = useState<GameStatus>('playing');
  const [visibleDialog, setVisibleDialog] = useState<GameStatus | null>(null);

  const {
    attemptsRemaining,
    currentGuess,
    guesses,
    keyboardHints,
    status,
    wordLength,
    onClickBackspace,
    onClickEnter,
    onClickLetter,
  } = useGame(game);

  useEffect(() => {
    if (status !== previousStatus) {
      setPreviousStatus(status);
      setVisibleDialog(status);
    }
  }, [status, previousStatus, setPreviousStatus, setVisibleDialog]);

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
          {guesses.map((guess, index) => (
            <Guess
              key={`previous-${index}`}
              length={wordLength}
              type="previous"
              {...guess}
            />
          ))}
          {status === 'playing' && guesses.length < game.maxAttempts && (
            <Guess
              key="current"
              length={wordLength}
              type="current"
              word={currentGuess}
            />
          )}
          {times(attemptsRemaining, (index) => (
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
            guesses={guesses}
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
