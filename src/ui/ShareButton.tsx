import { MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';

import styles from './ShareButton.module.scss';

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
          console.error(error.stack);

          window.open(fallbackShareUrl);
        });
      }
    },
    [canShare, fallbackShareUrl, shareData]
  );

  return (
    <a
      className={styles.link}
      href={fallbackShareUrl}
      rel="noopener noreferrer"
      target="_blank"
      onClick={onClick}
    >
      Share
    </a>
  );
};
