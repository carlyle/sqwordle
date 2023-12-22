import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import { ORIGIN } from '@app/config/public';
import { formatShareText, Game, Guess } from '@app/lib/game';
import { CountdownClock } from '@app/ui/CountdownClock';
import { Dialog, DialogProps, DialogTitle } from '@app/ui/Dialog';
import { ShareButton } from '@app/ui/ShareButton';

type Props = DialogProps & {
  game: Game;
  guesses: Guess[];
  nextGameStartsAt: number;
};

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

    <p className="mb-4 font-mono">
      Aww! {game.solution.toUpperCase()} got away!
    </p>
    <p className="mb-4 font-mono">
      The next pokémon will appear in{' '}
      <CountdownClock endAt={nextGameStartsAt} />
    </p>

    <ShareButton text={formatShareText({ game, guesses })} url={ORIGIN} />
  </Dialog>
);
