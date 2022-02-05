import { addDays, differenceInDays } from 'date-fns';

import { START_DATE } from '@app/config/public';
import { times } from '@app/lib/collections';
import { usePersistentStorage } from '@app/lib/storage';

export type Game = {
  day: number;
  endsAt: number;
  maxAttempts: number;
  solution: string;
  validWords: string[];
};

export type Guess = {
  results: LetterResult[];
  word: string;
};

export type GameState = {
  currentGuess: string;
  guesses: Guess[];
  status: GameStatus;
};

export type GameStatus = 'loading' | 'lost' | 'playing' | 'won';

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

const DEFAULT_GAME_STATE: GameState = {
  currentGuess: '',
  guesses: [],
  status: 'playing',
};

const PREFERRED_RESULTS = [
  LetterResult.Correct,
  LetterResult.Present,
  LetterResult.Incorrect,
  LetterResult.Empty,
];

export const RESULT_EMOJI: { [result in LetterResult]: string } = {
  [LetterResult.Correct]: '🟩',
  [LetterResult.Empty]: '⬜',
  [LetterResult.Incorrect]: '⬜',
  [LetterResult.Present]: '🟨',
};

export const RESULT_LABELS: { [result in LetterResult]: string } = {
  [LetterResult.Correct]: 'Correct',
  [LetterResult.Empty]: '',
  [LetterResult.Incorrect]: 'Incorrect',
  [LetterResult.Present]: 'Present',
};

export const collectKeyboardHints = (
  guesses: Guess[]
): Record<string, LetterResult> => {
  const hints: Record<string, LetterResult> = {};

  for (const { results, word } of guesses) {
    for (let index = 0; index < results.length; index++) {
      const letter = word[index];
      const result = results[index];

      if (isBetterResult(result, hints[letter] || LetterResult.Empty)) {
        hints[letter] = result;
      }
    }
  }

  return hints;
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
  guesses: Guess[];
}): string => {
  return [
    `SQWORDLE #${game.day} ${guesses.length}/${game.maxAttempts}`,
    '',
    ...guesses.map(({ results }) =>
      results.map((result) => RESULT_EMOJI[result]).join('')
    ),
  ].join('\n');
};

export const getDay = ({
  startDate = START_DATE,
}: {
  startDate?: Date;
} = {}): number => {
  const daysSinceStart = differenceInDays(Date.now(), startDate);
  if (daysSinceStart < 0) {
    throw new Error(
      `Unable to determine the current day number, the startDate is in the future`
    );
  }

  return daysSinceStart + 1;
};

export const getGameForDay = ({
  day,
  startDate = START_DATE,
  words,
}: {
  day: number;
  startDate?: Date;
  words: string[];
}): Game => {
  const endsAt = addDays(startDate, day).getTime();
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

const isGameState = (value: unknown): value is GameState =>
  typeof value === 'object' &&
  value !== null &&
  typeof (<GameState>value).currentGuess === 'string';

export const parseGameState = (serializedState: string): GameState => {
  const gameState = JSON.parse(serializedState);
  if (!isGameState(gameState)) {
    throw new Error(`Invalid game state: ${serializedState}`);
  }

  return gameState;
};

export const useGame = ({ day, maxAttempts, solution, validWords }: Game) => {
  const gameState = usePersistentStorage<GameState>(
    `days[${day}]`,
    DEFAULT_GAME_STATE,
    {
      deserialize: parseGameState,
    }
  );

  const { currentGuess, guesses, status } = gameState.value;

  const attempt = guesses.length + (status === 'playing' ? 1 : 0);
  const attemptsRemaining = maxAttempts - attempt;
  const keyboardHints = collectKeyboardHints(guesses);
  const wordLength = solution.length;

  let onClickBackspace: (() => void) | undefined = undefined;
  let onClickEnter: (() => void) | undefined = undefined;
  let onClickLetter: ((letter: string) => void) | undefined = undefined;
  if (gameState.status === 'loaded' && status === 'playing') {
    if (currentGuess.length > 0) {
      onClickBackspace = () => {
        gameState.update({
          currentGuess: currentGuess.slice(0, currentGuess.length - 1),
        });
      };
    }

    if (currentGuess.length < wordLength) {
      onClickLetter = (letter: string) => {
        gameState.update({ currentGuess: `${currentGuess}${letter}` });
      };
    }

    if (currentGuess.length === wordLength) {
      onClickEnter = () => {
        if (!validWords.includes(currentGuess)) {
          window.alert("Sorry, that's not a pokemon");
          return;
        }

        const results = evaluateGuess({ guess: currentGuess, solution });
        let eventName: string;
        let newStatus: GameStatus;

        if (results.every((result) => result === LetterResult.Correct)) {
          eventName = 'Win';
          newStatus = 'won';
        } else if (attempt === maxAttempts) {
          eventName = 'Lose';
          newStatus = 'lost';
        } else {
          eventName = 'Guess';
          newStatus = 'playing';
        }

        gameState.update({
          currentGuess: '',
          guesses: [
            ...guesses,
            {
              results,
              word: currentGuess,
            },
          ],
          status: newStatus,
        });
      };
    }
  }

  return {
    attemptsRemaining,
    currentGuess,
    guesses,
    keyboardHints,
    status: gameState.status === 'loaded' ? status : 'loading',
    wordLength,
    onClickBackspace,
    onClickEnter,
    onClickLetter,
  };
};
