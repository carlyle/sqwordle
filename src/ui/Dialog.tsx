import {
  Dialog as DialogRoot,
  DialogClose,
  DialogContent,
  DialogPortal,
  DialogTitle,
} from '@radix-ui/react-dialog';
import { ReactNode, useCallback, useState } from 'react';

import styles from './Dialog.module.scss';

export type DialogProps = {
  onClose: () => void;
};

export { DialogTitle };

export const Dialog = ({
  children,
  onClose,
}: DialogProps & { children: ReactNode }) => {
  const [open, setOpen] = useState(true);

  const onOpenChange = useCallback(
    (open: boolean) => {
      setOpen(open);
      onClose();
    },
    [onClose, setOpen]
  );

  return (
    <DialogRoot modal={false} open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogContent className={styles.content}>
          {children}
          <DialogClose asChild className={styles.closeButtonWrapper}>
            <button aria-label="Close" className={styles.closeButton}>
              <span aria-hidden>⨉</span>
            </button>
          </DialogClose>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
};
