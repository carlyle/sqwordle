import { Temporal } from '@js-temporal/polyfill';
import { START_DATE, TIMEZONE } from '@app/config/public';
import { times } from '@app/lib/collections';
import { usePersistentStorage } from '@app/lib/storage';

export type Game = {
  date: GameDate;
  maxAttempts: number;
  number: number;
  solution: string;
  validWords: string[];
};

export type GameDate = {
  day: number;
  /** 1-indexed, like Temporal */
  month: number;
  year: number;
};

export type GameState = {
  currentGuess: string;
  guesses: Guess[];
  status: GameStatus;
};

export type GameStatus = 'loading' | 'lost' | 'playing' | 'won';

export type Guess = {
  results: LetterResult[];
  word: string;
};

export type GuessType = 'current' | 'future' | 'previous';

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
  const lastGuess = guesses[guesses.length - 1];
  const guessCount = lastGuess.word === game.solution ? guesses.length : 'X';

  return [
    `SQWORDLE #${game.number} ${guessCount}/${game.maxAttempts}`,
    '',
    ...guesses.map(({ results }) =>
      results.map((result) => RESULT_EMOJI[result]).join('')
    ),
  ].join('\n');
};

const getDifferenceInDays = (to: GameDate, from: GameDate): number => {
  const toDate = Temporal.PlainDate.from({
    year: to.year,
    month: to.month,
    day: to.day,
  });
  const fromDate = Temporal.PlainDate.from({
    year: from.year,
    month: from.month,
    day: from.day,
  });

  return toDate.since(fromDate, { largestUnit: 'day' }).days;
};

export const getGameDate = (): GameDate => {
  const now = Temporal.Now.plainDateISO(TIMEZONE);

  return { day: now.day, month: now.month, year: now.year };
};

export const getGameForDate = ({
  date,
  words,
}: {
  date: GameDate;
  words: string[];
}): Game => {
  const number = getGameNumber(date) + 1;
  const solution = words[(number - 1) % words.length];
  const validWords = words.filter((word) => word.length === solution.length);

  return {
    date,
    maxAttempts: 6,
    number,
    solution,
    validWords,
  };
};

export const getGameNumber = (gameDate: GameDate): number =>
  getDifferenceInDays(gameDate, parseGameDate(START_DATE));

export const isBetterResult = (
  result: LetterResult,
  otherResult: LetterResult
): boolean =>
  PREFERRED_RESULTS.indexOf(result) <= PREFERRED_RESULTS.indexOf(otherResult);

const isGameState = (value: unknown): value is GameState =>
  typeof value === 'object' &&
  value !== null &&
  typeof (<GameState>value).currentGuess === 'string';

const GAME_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
export const parseGameDate = (dateString: string): GameDate => {
  const matches = dateString.match(GAME_DATE_PATTERN);
  if (!matches) {
    throw new Error(`Unable to parse ${dateString} as a GameDate`);
  }

  return {
    day: Number(matches[3]),
    month: Number(matches[2]), // months are 1-indexed
    year: Number(matches[1]),
  };
};

export const parseGameState = (serializedState: string): GameState => {
  const gameState = JSON.parse(serializedState);
  if (!isGameState(gameState)) {
    throw new Error(`Invalid game state: ${serializedState}`);
  }

  return gameState;
};

export const useGame = ({
  maxAttempts,
  number,
  solution,
  validWords,
}: Game) => {
  const gameState = usePersistentStorage<GameState>(
    `days[${number}]`,
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
