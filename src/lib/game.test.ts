import {
  collectKeyboardHints,
  countLetters,
  evaluateGuess,
  formatShareText,
  getGameForDay,
  isBetterResult,
  LetterResult,
} from '@app/lib/game';

describe('collectKeyboardHints', () => {
  it('returns a map from each letter in the alphabet to their best available result', () => {
    expect(
      collectKeyboardHints([
        {
          results: [
            LetterResult.Present,
            LetterResult.Present,
            LetterResult.Present,
          ],
          word: 'abc',
        },
      ])
    ).toEqual({
      a: LetterResult.Present,
      b: LetterResult.Present,
      c: LetterResult.Present,
    });

    expect(
      collectKeyboardHints([
        {
          results: [
            LetterResult.Present,
            LetterResult.Present,
            LetterResult.Present,
          ],
          word: 'abc',
        },
        {
          results: [
            LetterResult.Incorrect,
            LetterResult.Incorrect,
            LetterResult.Incorrect,
          ],
          word: 'def',
        },
      ])
    ).toEqual({
      a: LetterResult.Present,
      b: LetterResult.Present,
      c: LetterResult.Present,
      d: LetterResult.Incorrect,
      e: LetterResult.Incorrect,
      f: LetterResult.Incorrect,
    });

    expect(
      collectKeyboardHints([
        {
          results: [
            LetterResult.Present,
            LetterResult.Present,
            LetterResult.Present,
          ],
          word: 'abc',
        },
        {
          results: [
            LetterResult.Present,
            LetterResult.Present,
            LetterResult.Incorrect,
          ],
          word: 'aba',
        },
      ])
    ).toEqual({
      a: LetterResult.Present,
      b: LetterResult.Present,
      c: LetterResult.Present,
    });

    expect(
      collectKeyboardHints([
        {
          results: [
            LetterResult.Present,
            LetterResult.Present,
            LetterResult.Present,
          ],
          word: 'abc',
        },
        {
          results: [
            LetterResult.Correct,
            LetterResult.Correct,
            LetterResult.Correct,
          ],
          word: 'cab',
        },
      ])
    ).toEqual({
      a: LetterResult.Correct,
      b: LetterResult.Correct,
      c: LetterResult.Correct,
    });
  });

  it('returns an empty map by default', () => {
    expect(collectKeyboardHints([])).toEqual({});
  });
});

describe('countLetters', () => {
  it("returns a map from the given word's letters to their counts", () => {
    expect(countLetters('abc')).toEqual({ a: 1, b: 1, c: 1 });
    expect(countLetters('aaa')).toEqual({ a: 3 });
  });
});

describe('evaluateGuess', () => {
  it('can evaluate totally incorrect guesses', () => {
    expect(evaluateGuess({ guess: 'noope', solution: 'right' })).toEqual([
      LetterResult.Incorrect,
      LetterResult.Incorrect,
      LetterResult.Incorrect,
      LetterResult.Incorrect,
      LetterResult.Incorrect,
    ]);
  });

  it('can evaluate partially correct guesses', () => {
    expect(evaluateGuess({ guess: 'evils', solution: 'solve' })).toEqual([
      LetterResult.Present,
      LetterResult.Present,
      LetterResult.Incorrect,
      LetterResult.Present,
      LetterResult.Present,
    ]);

    expect(evaluateGuess({ guess: 'halve', solution: 'solve' })).toEqual([
      LetterResult.Incorrect,
      LetterResult.Incorrect,
      LetterResult.Correct,
      LetterResult.Correct,
      LetterResult.Correct,
    ]);

    expect(evaluateGuess({ guess: 'salve', solution: 'solve' })).toEqual([
      LetterResult.Correct,
      LetterResult.Incorrect,
      LetterResult.Correct,
      LetterResult.Correct,
      LetterResult.Correct,
    ]);

    expect(evaluateGuess({ guess: 'broom', solution: 'loose' })).toEqual([
      LetterResult.Incorrect,
      LetterResult.Incorrect,
      LetterResult.Correct,
      LetterResult.Present,
      LetterResult.Incorrect,
    ]);

    expect(evaluateGuess({ guess: 'promo', solution: 'solve' })).toEqual([
      LetterResult.Incorrect,
      LetterResult.Incorrect,
      LetterResult.Present,
      LetterResult.Incorrect,
      LetterResult.Incorrect, // only 1 'o' is present in the solution
    ]);
  });

  it('can evaluate correct guesses', () => {
    expect(evaluateGuess({ guess: 'right', solution: 'right' })).toEqual([
      LetterResult.Correct,
      LetterResult.Correct,
      LetterResult.Correct,
      LetterResult.Correct,
      LetterResult.Correct,
    ]);
  });
});

describe('formatShareText', () => {
  it('returns a shareable summary of the game', () => {
    expect(
      formatShareText({
        game: {
          day: 1,
          endsAt: NaN, // unused
          maxAttempts: 5,
          solution: 'solution',
          validWords: [], // unused
        },
        guesses: [
          {
            results: [
              LetterResult.Correct,
              LetterResult.Correct,
              LetterResult.Correct,
              LetterResult.Correct,
              LetterResult.Correct,
              LetterResult.Correct,
              LetterResult.Correct,
              LetterResult.Correct,
            ],
            word: 'solution',
          },
        ],
      })
    ).toEqual('SQWORDLE #1 1/5\n\n🟩🟩🟩🟩🟩🟩🟩🟩');

    expect(
      formatShareText({
        game: {
          day: 123,
          endsAt: NaN, // unused
          maxAttempts: 10,
          solution: 'word',
          validWords: [], // unused
        },
        guesses: [
          {
            results: [
              LetterResult.Incorrect,
              LetterResult.Incorrect,
              LetterResult.Incorrect,
              LetterResult.Incorrect,
            ],
            word: 'miss',
          },
          {
            results: [
              LetterResult.Present,
              LetterResult.Present,
              LetterResult.Incorrect,
              LetterResult.Present,
            ],
            word: 'draw',
          },
          {
            results: [
              LetterResult.Correct,
              LetterResult.Correct,
              LetterResult.Incorrect,
              LetterResult.Correct,
            ],
            word: 'ward',
          },
          {
            results: [
              LetterResult.Correct,
              LetterResult.Correct,
              LetterResult.Correct,
              LetterResult.Correct,
            ],
            word: 'word',
          },
        ],
      })
    ).toEqual('SQWORDLE #123 4/10\n\n⬜⬜⬜⬜\n🟨🟨⬜🟨\n🟩🟩⬜🟩\n🟩🟩🟩🟩');
  });
});

describe('getGameForDay', () => {
  it("returns the requested day's game", () => {
    expect(
      getGameForDay({
        day: 1,
        startDate: new Date(2022, 0, 1),
        words: ['first', 'second', 'third'],
      })
    ).toEqual({
      day: 1,
      endsAt: new Date(2022, 0, 2).getTime(),
      maxAttempts: 6,
      solution: 'first',
      validWords: ['first', 'third'],
    });

    expect(
      getGameForDay({
        day: 2,
        startDate: new Date(2022, 0, 1),
        words: ['first', 'second', 'third'],
      })
    ).toEqual({
      day: 2,
      endsAt: new Date(2022, 0, 3).getTime(),
      maxAttempts: 6,
      solution: 'second',
      validWords: ['second'],
    });
  });

  it("returns a list of valid words with the same length as the day's solution", () => {
    expect(
      getGameForDay({
        day: 1,
        startDate: new Date(2022, 0, 1),
        words: ['first', 'second', 'third'],
      }).validWords
    ).toEqual(['first', 'third']);

    expect(
      getGameForDay({
        day: 2,
        startDate: new Date(2022, 0, 1),
        words: ['first', 'second', 'third'],
      }).validWords
    ).toEqual(['second']);
  });

  it('wraps around to the start of the list when the number of days exceeds the number of words', () => {
    expect(
      getGameForDay({
        day: 4,
        startDate: new Date(2022, 0, 1),
        words: ['first', 'second', 'third'],
      })
    ).toEqual({
      day: 4,
      endsAt: new Date(2022, 0, 5).getTime(),
      maxAttempts: 6,
      solution: 'first',
      validWords: ['first', 'third'],
    });
  });
});

describe('isBetterResult', () => {
  it('prefers correct results over all others', () => {
    expect(isBetterResult(LetterResult.Correct, LetterResult.Empty)).toBe(true);
    expect(isBetterResult(LetterResult.Correct, LetterResult.Incorrect)).toBe(
      true
    );
    expect(isBetterResult(LetterResult.Correct, LetterResult.Present)).toBe(
      true
    );
  });

  it('prefers present results over incorrect/empty ones', () => {
    expect(isBetterResult(LetterResult.Present, LetterResult.Empty)).toBe(true);
    expect(isBetterResult(LetterResult.Present, LetterResult.Incorrect)).toBe(
      true
    );

    expect(isBetterResult(LetterResult.Present, LetterResult.Correct)).toBe(
      false
    );
  });

  it('prefers incorrect results over empty ones', () => {
    expect(isBetterResult(LetterResult.Incorrect, LetterResult.Empty)).toBe(
      true
    );

    expect(isBetterResult(LetterResult.Incorrect, LetterResult.Correct)).toBe(
      false
    );
    expect(isBetterResult(LetterResult.Incorrect, LetterResult.Present)).toBe(
      false
    );
  });

  it('never prefers empty results', () => {
    expect(isBetterResult(LetterResult.Empty, LetterResult.Incorrect)).toBe(
      false
    );
    expect(isBetterResult(LetterResult.Empty, LetterResult.Correct)).toBe(
      false
    );
    expect(isBetterResult(LetterResult.Empty, LetterResult.Present)).toBe(
      false
    );
  });
});
