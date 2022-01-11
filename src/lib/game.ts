import { addDays, differenceInDays } from 'date-fns';
import { useState } from 'react';

import { START_DATE } from '@app/config/public';
import { useAnalytics } from '@app/lib/analytics';
import { times } from '@app/lib/collections';

export type Game = {
  day: number;
  endsAt: number;
  maxAttempts: number;
  solution: string;
  validWords: string[];
};

export type GameState = 'lost' | 'playing' | 'won';

export type Guess = {
  results: LetterResult[];
  word: string;
};

export enum LetterResult {
  Correct = 'correct',
  Empty = 'empty',
  Incorrect = 'incorrect',
  Present = 'present',
}

export const ALPHABET = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
];

const PREFERRED_RESULTS = [
  LetterResult.Correct,
  LetterResult.Present,
  LetterResult.Incorrect,
  LetterResult.Empty,
];

export const RESULT_EMOJI: { [result in LetterResult]: string } = {
  [LetterResult.Correct]: '🟩',
  [LetterResult.Empty]: '◻️',
  [LetterResult.Incorrect]: '◻️',
  [LetterResult.Present]: '🟨',
};

export const RESULT_LABELS: { [result in LetterResult]: string } = {
  [LetterResult.Correct]: 'Correct',
  [LetterResult.Empty]: '',
  [LetterResult.Incorrect]: 'Incorrect',
  [LetterResult.Present]: 'Present',
};

export const countLetters = (word: string): Record<string, number> =>
  word.split('').reduce(
    (counts, item) => ({
      ...counts,
      [item]: (counts[item] || 0) + 1,
    }),
    {} as Record<string, number>
  );

export const evaluateGuess = ({
  guess,
  solution,
}: {
  guess: string;
  solution: string;
}): LetterResult[] => {
  const length = solution.length;
  if (guess.length !== length) {
    throw new TypeError(
      `${JSON.stringify(guess)} is not a valid guess (wrong number of letters)`
    );
  }

  const expectedLetterCounts = countLetters(solution);
  const results: LetterResult[] = times(length, () => LetterResult.Incorrect);

  // identify all correct letters
  for (let index = 0; index < length; index++) {
    const letter = guess[index];
    if (letter === solution[index]) {
      results[index] = LetterResult.Correct;
      expectedLetterCounts[letter]--;
    }
  }

  // identify letters that are present in the solution but incorrectly positioned
  for (let index = 0; index < length; index++) {
    if (results[index] === LetterResult.Correct) {
      continue;
    }

    const letter = guess[index];
    if (
      typeof expectedLetterCounts[letter] === 'number' &&
      expectedLetterCounts[letter] > 0
    ) {
      results[index] = LetterResult.Present;
      expectedLetterCounts[letter]--;
    }
  }

  return results;
};

export const formatShareText = ({
  game,
  guesses,
}: {
  game: Game;
  guesses: { guess: string; results: LetterResult[] }[];
}): string => {
  return [
    `SQWORDLE #${game.day} ${guesses.length}/${game.maxAttempts}`,
    '',
    ...guesses.map(({ results }) =>
      results.map((result) => RESULT_EMOJI[result]).join('')
    ),
  ].join('\n');
};

export const getGameForToday = ({ words }: { words: string[] }): Game =>
  getGameForDay({
    day: differenceInDays(START_DATE, Date.now()) + 1,
    words,
  });

export const getGameForDay = ({
  day,
  words,
}: {
  day: number;
  words: string[];
}): Game => {
  const endsAt = addDays(START_DATE, day).getTime();
  const solution = words[(day - 1) % words.length];
  const validWords = words.filter((word) => word.length === solution.length);

  return {
    day,
    endsAt,
    maxAttempts: 6,
    solution,
    validWords,
  };
};

export const isBetterResult = (
  result: LetterResult,
  otherResult: LetterResult
): boolean =>
  PREFERRED_RESULTS.indexOf(result) <= PREFERRED_RESULTS.indexOf(otherResult);

export const useGame = ({ day, maxAttempts, solution, validWords }: Game) => {
  const { trackEvent } = useAnalytics();
  const [previousGuesses, setPreviousGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');

  const wordLength = solution.length;
  const keyboardHints = ALPHABET.reduce(
    (hints, letter) => ({ ...hints, [letter]: LetterResult.Empty }),
    {} as Record<string, LetterResult>
  );
  const previousResults: LetterResult[][] = [];
  let gameState: GameState = 'playing';
  for (const guess of previousGuesses) {
    const results = evaluateGuess({ guess, solution });
    for (let index = 0; index < wordLength; index++) {
      const letter = guess[index];
      const result = results[index];
      if (isBetterResult(result, keyboardHints[letter])) {
        keyboardHints[letter] = result;
      }
    }
    previousResults.push(results);

    if (results.every((result) => result === LetterResult.Correct)) {
      gameState = 'won';
    }
  }
  if (previousGuesses.length === maxAttempts && gameState !== 'won') {
    gameState = 'lost';
  }

  const futureGuessCount =
    maxAttempts - previousGuesses.length - (gameState === 'playing' ? 1 : 0);

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
          if (!validWords.includes(currentGuess)) {
            window.alert("Sorry, that's not a pokemon");
            return;
          }

          const attempt = previousGuesses.length + 1;
          const results = evaluateGuess({
            guess: currentGuess,
            solution: solution,
          });

          let eventName: string;
          if (results.every((result) => result === LetterResult.Correct)) {
            eventName = 'Win';
          } else if (attempt === maxAttempts) {
            eventName = 'Lose';
          } else {
            eventName = 'Guess';
          }

          setPreviousGuesses((previousGuesses) => [
            ...previousGuesses,
            currentGuess,
          ]);
          setCurrentGuess('');

          trackEvent({
            eventName,
            props: {
              attempt,
              day,
              maxAttempts,
              wordLength,
            },
          });
        }
      : undefined;

  const onClickLetter =
    gameState === 'playing' && currentGuess.length < wordLength
      ? (letter: string) => {
          setCurrentGuess((currentGuess) => `${currentGuess}${letter}`);
        }
      : undefined;

  return {
    currentGuess,
    futureGuessCount,
    gameState,
    keyboardHints,
    previousGuesses: previousGuesses.map((guess, index) => ({
      guess,
      results: previousResults[index],
    })),
    wordLength,
    onClickBackspace,
    onClickEnter,
    onClickLetter,
  };
};
