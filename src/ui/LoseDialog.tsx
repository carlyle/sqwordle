import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import { ORIGIN } from '@app/config/public';
import { formatShareText, Game, Guess } from '@app/lib/game';
import { styled } from '@app/ui/core';
import { CountdownClock } from '@app/ui/CountdownClock';
import { Dialog, DialogProps, DialogTitle } from '@app/ui/Dialog';
import { ShareButton } from '@app/ui/ShareButton';

type Props = DialogProps & {
  game: Game;
  guesses: Guess[];
  nextGameStartsAt: number;
};

const Text = styled('p', {
  margin: '0 0 1rem 0',

  fontSize: '$md',
});

export const LoseDialog = ({
  game,
  guesses,
  nextGameStartsAt,
  onClose,
}: Props) => (
  <Dialog onClose={onClose}>
    <VisuallyHidden asChild>
      <DialogTitle>Failure</DialogTitle>
    </VisuallyHidden>

    <Text>Aww! {game.solution.toUpperCase()} got away!</Text>
    <Text>
      The next pokémon will appear in{' '}
      <CountdownClock endAt={nextGameStartsAt} />
    </Text>

    <ShareButton text={formatShareText({ game, guesses })} url={ORIGIN} />
  </Dialog>
);
