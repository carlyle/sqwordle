'use client';

import { MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';

type Props = {
  text: string;
  url: string;
};

const buildTwitterUrl = ({ text, url }: Props): string => {
  const twitterUrl = new URL('https://twitter.com/intent/tweet');
  twitterUrl.searchParams.append('text', text);
  twitterUrl.searchParams.append('url', url);

  return twitterUrl.toString();
};

export const ShareButton = ({ text, url }: Props) => {
  const [canShare, setCanShare] = useState<boolean | undefined>(undefined);
  const shareData = useMemo<ShareData>(
    () => ({
      text,
      url,
    }),
    [text, url]
  );
  const fallbackShareUrl = buildTwitterUrl({ text, url });

  useEffect(() => {
    if (typeof navigator.canShare === 'function') {
      setCanShare(navigator.canShare(shareData));
    } else {
      setCanShare(false);
    }
  }, [shareData, setCanShare]);

  const onClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (canShare) {
        event.preventDefault();

        navigator.share(shareData).catch((error) => {
          if (error instanceof Error && error.name === 'AbortError') {
            // the share was cancelled
            return;
          }

          window.open(fallbackShareUrl);
        });
      }
    },
    [canShare, fallbackShareUrl, shareData]
  );

  return (
    <a
      className="inline-block border border-dashed border-indigo-600 p-1.5 font-mono leading-4 text-indigo-800"
      href={fallbackShareUrl}
      rel="noopener noreferrer"
      target="_blank"
      onClick={onClick}
    >
      Share
    </a>
  );
};
