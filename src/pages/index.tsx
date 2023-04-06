import { differenceInSeconds } from 'date-fns';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';

import { ORIGIN } from '@app/config/public';
import { times } from '@app/lib/collections';
import {
  Game,
  GameStatus,
  getDay,
  getGameForDay,
  useGame,
} from '@app/lib/game';
import { GuessWord } from '@app/ui/GuessWord';
import { Keyboard } from '@app/ui/Keyboard';
import { LoseDialog } from '@app/ui/LoseDialog';
import { WinDialog } from '@app/ui/WinDialog';
import { styled } from '@app/ui/core';

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

const Disclaimer = styled('p', {
  margin: '0 auto 0.5rem auto',
  width: '80%',

  color: '$slate11',
  fontSize: '$xs',
  lineHeight: 1.1,
  textAlign: 'center',

  '@md': {
    fontSize: '$md',
  },

  '& a': {
    color: '$indigo11',
    textDecoration: 'none',
  },
});

const GuessesContainer = styled('div', {
  marginBottom: '2rem',
});

const Heading = styled('h1', {
  margin: '1rem 0 0.25rem 0',

  fontSize: '$lg',
  textAlign: 'center',

  '@md': {
    fontSize: '$xl',
  },
});

const PageContainer = styled('div', {
  marginBottom: 220,
});

const Subhead = styled('h2', {
  margin: '0 0 1rem 0',
  fontSize: '$md',

  textAlign: 'center',

  '@md': {
    fontSize: '$lg',
  },
});

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
  const todaysTitle = `SQWORDLE #${game.day}`;

  return (
    <>
      <Head>
        <title>{todaysTitle}</title>

        <meta name="description" content="A Pokémon-themed take on Wordle" />
        <link rel="canonical" href={ORIGIN} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:description"
          content="A Pokémon-themed take on Wordle"
        />
        <meta name="twitter:image" content={shareImageUrl.toString()} />
        <meta name="twitter:title" content="SQWORDLE" />
        <meta name="twitter:url" content={ORIGIN} />

        <meta
          property="og:description"
          content="A Pokémon-themed take on Wordle"
        />
        <meta property="og:image" content={shareImageUrl.toString()} />
        <meta property="og:title" content="SQWORDLE" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={ORIGIN} />
      </Head>

      <PageContainer>
        <Heading>SQWORDLE #{game.day}</Heading>
        <Subhead>Who&apos;s that Pokémon?</Subhead>

        <GuessesContainer>
          {guesses.map((guess, index) => (
            <GuessWord
              key={`previous-${index}`}
              length={wordLength}
              type="previous"
              {...guess}
            />
          ))}
          {status === 'playing' && guesses.length < game.maxAttempts && (
            <GuessWord
              key="current"
              length={wordLength}
              type="current"
              word={currentGuess}
            />
          )}
          {times(attemptsRemaining, (index) => (
            <GuessWord
              key={`future-${index}`}
              length={wordLength}
              type="future"
            />
          ))}
        </GuessesContainer>

        <Disclaimer className="disclaimer">
          A Pokémon-themed take on{' '}
          <a
            href="https://www.nytimes.com/games/wordle/index.html"
            rel="noopener noreferrer"
            target="_blank"
          >
            Wordle
          </a>
          .
        </Disclaimer>
        <Disclaimer className="disclaimer">
          Please don&apos;t sue me, Nintendo.
        </Disclaimer>
        <Disclaimer className="disclaimer">
          <a
            href="https://github.com/carlyle/sqwordle"
            rel="noopener noreferrer"
            target="_blank"
          >
            View Source
          </a>
        </Disclaimer>

        <Keyboard
          hints={keyboardHints}
          onClickBackspace={onClickBackspace}
          onClickEnter={onClickEnter}
          onClickLetter={onClickLetter}
        />

        {visibleDialog === 'lost' && (
          <LoseDialog
            game={game}
            guesses={guesses}
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
      </PageContainer>
    </>
  );
};

export default HomePage;
