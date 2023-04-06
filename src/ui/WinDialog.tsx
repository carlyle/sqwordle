import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import { ORIGIN } from '@app/config/public';
import { formatShareText, Game, Guess } from '@app/lib/game';
import { CountdownClock } from '@app/ui/CountdownClock';
import { Dialog, DialogProps, DialogTitle } from '@app/ui/Dialog';
import { ShareButton } from '@app/ui/ShareButton';

import styles from './WinDialog.module.scss';

export type Props = DialogProps & {
  game: Game;
  guesses: Guess[];
  nextGameStartsAt: number;
};

export const WinDialog = ({
  game,
  guesses,
  nextGameStartsAt,
  onClose,
}: Props) => (
  <Dialog onClose={onClose}>
    <VisuallyHidden asChild>
      <DialogTitle>Success!</DialogTitle>
    </VisuallyHidden>

    <p className={styles.text}>
      Gotcha! {game.solution.toUpperCase()} was caught!
    </p>
    <p className={styles.text}>
      The next pokémon will appear in{' '}
      <CountdownClock endAt={nextGameStartsAt} />
    </p>

    <ShareButton text={formatShareText({ game, guesses })} url={ORIGIN} />
  </Dialog>
);
