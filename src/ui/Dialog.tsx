import {
  Dialog as DialogRoot,
  DialogClose as UnstyledDialogClose,
  DialogContent as UnstyledDialogContent,
  DialogPortal,
  DialogTitle,
} from '@radix-ui/react-dialog';
import { ReactNode, useCallback, useState } from 'react';

import { styled } from '@app/ui/core';

export type DialogProps = {
  onClose: () => void;
};

const CloseButton = styled('button', {
  appearance: 'none',
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',

  fontSize: '$md',
});

const DialogClose = styled(UnstyledDialogClose, {
  position: 'absolute',
  right: 10,
  top: 10,
});

const DialogContent = styled(UnstyledDialogContent, {
  left: '50%',
  minWidth: '60%',
  padding: '40px 20px 20px 20px',
  position: 'fixed',
  top: '33%',
  transform: 'translate3d(-50%, -50%, 0)',

  backgroundColor: '$white',
  borderColor: '$slate7',
  borderStyle: 'dashed',
  borderWidth: 1,
});

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
        <DialogContent>
          {children}
          <DialogClose asChild>
            <CloseButton aria-label="Close">
              <span aria-hidden>⨉</span>
            </CloseButton>
          </DialogClose>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
};
