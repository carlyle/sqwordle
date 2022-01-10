import { PropsWithChildren } from 'react';
import { Dialog as ReakitDialog, useDialogState } from 'reakit/Dialog';

export type Props = {
  'aria-label'?: string;
  tabIndex?: number;
  onClose: () => void;
};

const Dialog = ({ children, onClose, ...props }: PropsWithChildren<Props>) => {
  const dialog = useDialogState({ visible: true });

  return (
    <>
      <ReakitDialog {...dialog} {...props}>
        <div className="dialog">
          <header>
            <button aria-label="Close" className="close" onClick={onClose}>
              <span aria-hidden>⨉</span>
            </button>
          </header>
          <div className="content">{children}</div>
        </div>
      </ReakitDialog>

      <style jsx>{`
        .dialog {
          left: 50%;
          min-width: 50%;
          padding: 20px;
          position: fixed;
          top: 33%;
          transform: translate3d(-50%, -50%, 0);

          background-color: #ffffff;
          border: dashed 1px #111111;
        }

        header {
          height: 50px;
        }

        .close {
          position: absolute;
          right: 10px;
          top: 10px;

          appearance: none;
          background-color: transparent;
          border: none;
          cursor: pointer;

          font-size: 14px;
        }
      `}</style>
    </>
  );
};

export default Dialog;
