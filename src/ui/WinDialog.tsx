import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import { ORIGIN } from '@app/config/public';
import { formatShareText, Game, Guess } from '@app/lib/game';
import { CountdownClock } from '@app/ui/CountdownClock';
import {
  Dialog,
  DialogDescription,
  DialogProps,
  DialogTitle,
} from '@app/ui/Dialog';
import { ShareBar } from '@app/ui/ShareBar';

interface Props extends DialogProps {
  game: Game;
  guesses: Guess[];
}

export const WinDialog = ({ game, guesses, onClose }: Props) => (
  <Dialog onClose={onClose}>
    <VisuallyHidden asChild>
      <DialogTitle>Success!</DialogTitle>
    </VisuallyHidden>

    <div className="flex flex-col items-start gap-4">
      <DialogDescription className="font-mono">
        Gotcha! {game.solution.toUpperCase()} was caught!
      </DialogDescription>
      <p className="font-mono">
        The next pokémon will appear in <CountdownClock game={game} />
      </p>

      <ShareBar text={formatShareText({ game, guesses })} url={ORIGIN} />
    </div>
  </Dialog>
);
