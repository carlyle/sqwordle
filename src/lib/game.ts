import { times } from '@app/lib/collections';

export type Game = {
  day: number;
  maxGuesses: number;
  solution: string;
  validWords: string[];
};

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

export const isBetterResult = (
  result: LetterResult,
  otherResult: LetterResult
): boolean =>
  PREFERRED_RESULTS.indexOf(result) <= PREFERRED_RESULTS.indexOf(otherResult);
