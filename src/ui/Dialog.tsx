import {
  Dialog as DialogRoot,
  DialogClose,
  DialogContent,
  DialogPortal,
  DialogTitle,
} from '@radix-ui/react-dialog';
import { ReactNode, useCallback, useState } from 'react';

export interface DialogProps {
  onClose: () => void;
}

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
        <DialogContent className="fixed left-1/2 top-1/3 min-w-[60%] -translate-x-1/2 -translate-y-1/2 border border-dashed border-slate-300 bg-white p-5 pt-10">
          {children}
          <DialogClose asChild className="absolute right-2.5 top-2.5">
            <button aria-label="Close" className="px-1.5 py-px">
              <span aria-hidden>⨉</span>
            </button>
          </DialogClose>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
};
