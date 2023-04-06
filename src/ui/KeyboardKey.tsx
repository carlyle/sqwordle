import classNames from 'classnames';

import { LetterResult, RESULT_LABELS } from '@app/lib/game';

import styles from './KeyboardKey.module.scss';

type Props = {
  children: string;
  hint: LetterResult;
  letter: string;
  onClick?: () => void;
};

export const KeyboardKey = ({ children, hint, letter, onClick }: Props) => (
  <button
    aria-details={RESULT_LABELS[hint]}
    aria-label={letter}
    className={classNames(styles.key, styles[hint])}
    disabled={typeof onClick === 'undefined'}
    onClick={onClick}
  >
    <span aria-hidden>{children}</span>
  </button>
);
