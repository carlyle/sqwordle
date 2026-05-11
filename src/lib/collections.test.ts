import { times } from '@app/lib/collections';

describe('times', () => {
  it('executes the callback the requested number of times', () => {
    let count = 0;

    times(10, () => {
      count++;
    });

    expect(count).toBe(10);
  });

  it('returns the results of each callback', () => {
    expect(times(5, (index) => index + 1)).toEqual([1, 2, 3, 4, 5]);
  });
});
