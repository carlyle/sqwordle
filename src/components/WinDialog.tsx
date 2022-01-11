import CountdownClock from '@app/components/CountdownClock';
import Dialog, { Props as DialogProps } from '@app/components/Dialog';
import ShareButton from '@app/components/ShareButton';
import { ORIGIN } from '@app/config/public';
import { formatShareText, Game, LetterResult } from '@app/lib/game';

type Props = DialogProps & {
  game: Game;
  guesses: {
    guess: string;
    results: LetterResult[];
  }[];
  nextGameStartsAt: number;
};

const WinDialog = ({ game, guesses, nextGameStartsAt, onClose }: Props) => (
  <>
    <Dialog aria-label="Failure" tabIndex={0} onClose={onClose}>
      <p>Gotcha! {game.solution.toUpperCase()} was caught!</p>
      <p>
        The next pokémon will appear in{' '}
        <CountdownClock endAt={nextGameStartsAt} />
      </p>

      <ShareButton text={formatShareText({ game, guesses })} url={ORIGIN} />
    </Dialog>
    <style jsx>{`
      p {
        margin: 0 0 1em 0;

        font-size: 14px;
      }
    `}</style>
  </>
);

export default WinDialog;
