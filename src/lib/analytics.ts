import { usePlausible } from 'next-plausible';

export const useAnalytics = () => {
  const plausible = usePlausible();

  const trackEvent = ({
    eventName,
    props,
  }: {
    eventName: string;
    props?: Record<string, boolean | number | string>;
  }): void => {
    plausible(eventName, { props });
  };

  return {
    trackEvent,
  };
};
