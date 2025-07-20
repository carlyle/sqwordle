'use client';

import { useEffect, useState } from 'react';

import { times } from '@app/lib/collections';
import { Game, GameStatus, useGame } from '@app/lib/game';
import { Disclaimer, DisclaimerLink } from '@app/ui/Disclaimer';
import { GuessWord } from '@app/ui/GuessWord';
import { Keyboard } from '@app/ui/Keyboard';
import { LoseDialog } from '@app/ui/LoseDialog';
import { WinDialog } from '@app/ui/WinDialog';

export const GamePage = ({ game }: { game: Game }) => {
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

  return (
    <main className="mx-auto mb-[220px] max-w-[680px]">
      <h1 className="mt-4 mb-1 text-center font-mono text-2xl leading-[1.15] font-bold md:text-4xl">
        SQWORDLE #{game.day}
      </h1>
      <h2 className="mb-4 text-center font-mono text-sm font-bold md:text-2xl">
        Who&apos;s that Pokémon?
      </h2>

      <div className="mb-8">
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
      </div>

      <Disclaimer>
        A Pokémon-themed take on{' '}
        <DisclaimerLink
          href="https://www.nytimes.com/games/wordle/index.html"
          rel="noopener noreferrer"
          target="_blank"
        >
          Wordle
        </DisclaimerLink>
        .
      </Disclaimer>
      <Disclaimer>Please don&apos;t sue me, Nintendo.</Disclaimer>
      <Disclaimer>
        <DisclaimerLink
          href="https://github.com/carlyle/sqwordle"
          rel="noopener noreferrer"
          target="_blank"
        >
          View Source
        </DisclaimerLink>
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
    </main>
  );
};
