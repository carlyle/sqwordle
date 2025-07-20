'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

interface Props {
  text: string;
  url: string;
}

export const ShareBar = ({ text, url }: Props) => {
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [canShare, setCanShare] = useState<boolean | undefined>(undefined);

  const onCopiedToClipboard = useCallback(() => {
    setCopiedToClipboard(true);

    setTimeout(() => {
      setCopiedToClipboard(false);
    }, 1500);
  }, []);

  const shareData = useMemo<ShareData>(
    () => ({
      text,
      url,
    }),
    [text, url]
  );

  useEffect(() => {
    if (typeof navigator.canShare === 'function') {
      setCanShare(navigator.canShare(shareData));
    } else {
      setCanShare(false);
    }
  }, [shareData, setCanShare]);

  const onClick = useCallback(() => {
    if (canShare) {
      navigator.share(shareData).catch(() => {
        // do nothing
      });
    } else {
      navigator.clipboard
        .writeText(`${text} ${url}`)
        .then(() => {
          onCopiedToClipboard();
        })
        .catch(() => {
          // do nothing
        });
    }
  }, [canShare, onCopiedToClipboard, shareData, text, url]);

  return (
    <div className="flex items-center justify-start gap-4">
      <button
        className="inline-block border border-dashed border-indigo-600 p-1.5 font-mono leading-4 text-indigo-800"
        onClick={onClick}
      >
        Share
      </button>
      {copiedToClipboard && (
        <p className="font-mono text-sm text-green-800" role="alert">
          Copied to clipboard!
        </p>
      )}
    </div>
  );
};
