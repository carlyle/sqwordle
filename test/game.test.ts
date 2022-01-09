import { countLetters, evaluateGuess, LetterResult } from '@app/lib/game';

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
