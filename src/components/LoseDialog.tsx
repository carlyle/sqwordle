import CountdownClock from '@app/components/CountdownClock';
import Dialog, { Props as DialogProps } from '@app/components/Dialog';
import { Game } from '@app/lib/game';

type Props = DialogProps & {
  game: Game;
  nextGameStartsAt: number;
};

const LoseDialog = ({ game, nextGameStartsAt, onClose }: Props) => (
  <>
    <Dialog aria-label="Failure" tabIndex={0} onClose={onClose}>
      <p>Aww! {game.solution.toUpperCase()} got away!</p>
      <p>
        The next pokémon will appear in{' '}
        <CountdownClock endAt={nextGameStartsAt} />
      </p>
    </Dialog>
    <style jsx>{`
      p {
        margin: 0 0 1em 0;

        font-size: 14px;
      }
    `}</style>
  </>
);

export default LoseDialog;
