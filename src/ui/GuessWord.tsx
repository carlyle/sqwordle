import { times } from '@app/lib/collections';
import { GuessType, LetterResult } from '@app/lib/game';
import { styled } from '@app/ui/core';
import { GuessLetter } from '@app/ui/GuessLetter';

type Props = {
  length: number;
  results?: LetterResult[];
  type: GuessType;
  word?: string;
};

const Container = styled('div', {
  columnGap: 10,
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  justifyContent: 'space-between',
  margin: '0 auto 10px auto',
  width: '90%',

  '&:last-child': {
    marginBottom: 0,
  },
});

export const GuessWord = ({ length, results = [], type, word = '' }: Props) => (
  <Container>
    {times(length, (index) => (
      <GuessLetter
        key={String(index)}
        letter={word[index] || ' '}
        result={results[index] || LetterResult.Empty}
        type={type}
      />
    ))}
  </Container>
);
